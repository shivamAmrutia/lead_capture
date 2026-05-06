"use server";

import { leadSchema } from "@/lib/lead-schema";
import { createServerSupabaseClient } from "@/lib/supabase";

const webhookUrl = process.env.LEAD_WEBHOOK_URL;

type FieldName = "fullName" | "email" | "company" | "source" | "message";

export type SubmitLeadState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<FieldName, string>>;
};

export async function submitLead(
  _previousState: SubmitLeadState,
  formData: FormData,
): Promise<SubmitLeadState> {
  const parsed = leadSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    company: formData.get("company"),
    source: formData.get("source"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([key, value]) => [
          key,
          value?.[0],
        ]),
      ),
    };
  }

  const lead = parsed.data;
  let supabase;

  try {
    supabase = createServerSupabaseClient();
  } catch (configError) {
    console.error("Supabase configuration failed", configError);

    return {
      status: "error",
      message: "The form is temporarily unavailable. Please try again later.",
    };
  }

  const { data, error } = await supabase
    .from("leads")
    .insert({
      full_name: lead.fullName,
      email: lead.email,
      company: lead.company,
      source: lead.source,
      message: lead.message,
    })
    .select("id, full_name, email, company, source, message, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      return {
        status: "error",
        message: "That email has already been submitted.",
        fieldErrors: { email: "This email is already in our leads list" },
      };
    }

    console.error("Supabase insert failed", error);
    return {
      status: "error",
      message: "We could not save your submission. Please try again.",
    };
  }

  if (!webhookUrl) {
    console.error("Lead webhook skipped: missing LEAD_WEBHOOK_URL", {
      leadId: data.id,
    });

    return {
      status: "success",
      message: "Thanks, your information has been submitted.",
    };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Candidate-Name": process.env.CANDIDATE_NAME || "Your Name",
      },
      body: JSON.stringify({
        id: data.id,
        fullName: data.full_name,
        email: data.email,
        company: data.company,
        source: data.source,
        message: data.message,
        submittedAt: data.created_at,
      }),
    });

    if (!response.ok) {
      console.error("Lead webhook failed", {
        status: response.status,
        statusText: response.statusText,
        leadId: data.id,
      });
    }
  } catch (webhookError) {
    console.error("Lead webhook request failed", {
      error: webhookError,
      leadId: data.id,
    });
  }

  return {
    status: "success",
    message: "Thanks, your information has been submitted.",
  };
}
