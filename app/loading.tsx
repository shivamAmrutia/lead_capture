export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <section className="pt-4 sm:pt-10">
          <div className="h-4 w-52 animate-pulse rounded bg-teal-100" />
          <div className="mt-5 h-12 w-full max-w-lg animate-pulse rounded bg-slate-200" />
          <div className="mt-4 h-6 w-full max-w-md animate-pulse rounded bg-slate-200" />
        </section>

        <section
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          aria-label="Loading form"
        >
          <div className="mb-5 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2">
              <span
                className="size-4 animate-spin rounded-full border-2 border-slate-300 border-t-teal-700"
                aria-hidden="true"
              />
              Loading...
            </span>
          </div>
          <div className="grid gap-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index}>
                <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
                <div className="mt-2 h-11 w-full animate-pulse rounded-md bg-slate-100" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
