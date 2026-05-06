import { z } from "zod";

export const leadSources = ["Google", "Referral", "Social", "Other"] as const;

export const leadSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .max(120, "Full name must be 120 characters or fewer"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address")
    .max(254, "Email must be 254 characters or fewer")
    .transform((email) => email.toLowerCase()),
  company: z
    .string()
    .trim()
    .max(120, "Company must be 120 characters or fewer")
    .optional()
    .transform((value) => value || null),
  source: z.enum(leadSources, {
    message: "Choose how you heard about us",
  }),
  message: z
    .string()
    .trim()
    .max(2000, "Message must be 2000 characters or fewer")
    .optional()
    .transform((value) => value || null),
});

export type LeadInput = z.infer<typeof leadSchema>;
