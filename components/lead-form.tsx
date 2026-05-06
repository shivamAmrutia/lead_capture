"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitLead, type SubmitLeadState } from "@/app/actions";
import { leadSchema, leadSources } from "@/lib/lead-schema";

type FieldName = "fullName" | "email" | "company" | "source" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;

const initialState: SubmitLeadState = {
  status: "idle",
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-teal-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-auto"
    >
      {pending ? (
        <>
          <span
            className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            aria-hidden="true"
          />
          Submitting...
        </>
      ) : (
        "Submit lead"
      )}
    </button>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-red-700">{message}</p>;
}

export function LeadForm() {
  const [state, formAction] = useActionState(submitLead, initialState);
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const [clientMessage, setClientMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const parsed = leadSchema.safeParse({
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      company: formData.get("company"),
      source: formData.get("source"),
      message: formData.get("message"),
    });

    if (parsed.success) {
      setClientErrors({});
      setClientMessage("");
      return;
    }

    event.preventDefault();
    setClientMessage("Please fix the highlighted fields.");
    setClientErrors(
      Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([key, value]) => [
          key,
          value?.[0],
        ]),
      ),
    );
  }

  const visibleMessage = clientMessage || state.message;
  const visibleStatus = clientMessage ? "error" : state.status;
  const visibleErrors = { ...state.fieldErrors, ...clientErrors };

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={handleSubmit}
      className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      noValidate
    >
      {visibleMessage ? (
        <div
          className={`rounded-md border px-4 py-3 text-sm ${
            visibleStatus === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
          role={visibleStatus === "success" ? "status" : "alert"}
          aria-live="polite"
        >
          {visibleMessage}
        </div>
      ) : null}

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-slate-800">
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          required
          aria-invalid={Boolean(visibleErrors.fullName)}
          aria-describedby={visibleErrors.fullName ? "fullName-error" : undefined}
          className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-slate-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
        />
        <div id="fullName-error">
          <FieldError message={visibleErrors.fullName} />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-800">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(visibleErrors.email)}
          aria-describedby={visibleErrors.email ? "email-error" : undefined}
          className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-slate-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
        />
        <div id="email-error">
          <FieldError message={visibleErrors.email} />
        </div>
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-slate-800">
          Company
        </label>
        <input
          id="company"
          name="company"
          type="text"
          autoComplete="organization"
          aria-invalid={Boolean(visibleErrors.company)}
          aria-describedby={visibleErrors.company ? "company-error" : undefined}
          className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-slate-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
        />
        <div id="company-error">
          <FieldError message={visibleErrors.company} />
        </div>
      </div>

      <div>
        <label htmlFor="source" className="block text-sm font-medium text-slate-800">
          How did you hear about us?
        </label>
        <select
          id="source"
          name="source"
          required
          defaultValue=""
          aria-invalid={Boolean(visibleErrors.source)}
          aria-describedby={visibleErrors.source ? "source-error" : undefined}
          className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
        >
          <option value="" disabled>
            Select a source
          </option>
          {leadSources.map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </select>
        <div id="source-error">
          <FieldError message={visibleErrors.source} />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-800">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          aria-invalid={Boolean(visibleErrors.message)}
          aria-describedby={visibleErrors.message ? "message-error" : undefined}
          className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 text-slate-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
        />
        <div id="message-error">
          <FieldError message={visibleErrors.message} />
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SubmitButton />
        <a href="/leads" className="text-sm font-medium text-slate-700 hover:text-teal-800">
          View leads
        </a>
      </div>
    </form>
  );
}
