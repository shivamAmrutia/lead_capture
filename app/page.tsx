import { LeadForm } from "@/components/lead-form";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <section className="pt-4 sm:pt-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
            Secco Squared lead capture
          </p>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Let&apos;s start the conversation.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Share a few details and our team will follow up.
          </p>
        </section>

        <section aria-label="Lead capture form">
          <LeadForm />
        </section>
      </div>
    </main>
  );
}
