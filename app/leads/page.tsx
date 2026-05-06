import Link from "next/link";
import { createServerSupabaseClient, type LeadRow } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("leads")
    .select("id, full_name, email, company, source, message, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load leads", error);
  }

  const leads = (data ?? []) as LeadRow[];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
              Admin view
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Submitted leads</h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Most recent submissions appear first.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-100"
          >
            Back to form
          </Link>
        </div>

        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            Could not load leads. Check the server logs and Supabase environment variables.
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Name
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Email
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Company
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Source
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Submitted
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.length > 0 ? (
                    leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50">
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-950">
                          {lead.full_name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                          {lead.email}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                          {lead.company || "-"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                          {lead.source}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                          {new Intl.DateTimeFormat("en", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }).format(new Date(lead.created_at))}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-6 text-center text-slate-600" colSpan={5}>
                        No leads have been submitted yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
