# Lead Capture

A small Next.js app for collecting leads. The form saves each submission to Supabase and then sends the saved lead to a webhook from the server. There is also a simple `/leads` page for reviewing submissions.

## Local Setup

Install the dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CANDIDATE_NAME=Your Full Name
LEAD_WEBHOOK_URL=https://webhook-receiver-flax.vercel.app/api/lead-webhook
```

Then start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Database Setup

In Supabase, open the SQL editor and run the SQL from:

```text
supabase/schema.sql
```

That creates the `leads` table, turns on RLS, blocks anonymous client access, and adds a unique constraint on email so duplicate submissions can be handled cleanly.

## How It Works

The form lives on `/`. It validates in the browser first, then submits to a server action. The server action validates again, inserts the lead into Supabase, and posts the saved lead to the webhook.

The webhook is treated as a side effect. If Supabase succeeds but the webhook fails, the user still sees a successful submission and the webhook failure is logged on the server.

The `/leads` page reads from Supabase on the server and sorts leads by newest first.

## Local Webhook Testing

For local testing, `LEAD_WEBHOOK_URL` can point to any test receiver. For example, a local receiver can use:

```env
LEAD_WEBHOOK_URL=http://localhost:4000/lead-webhook
```

For the final deployed version, set it back to the provided endpoint:

```text
https://webhook-receiver-flax.vercel.app/api/lead-webhook
```

Every webhook request includes `X-Candidate-Name` using the value from `CANDIDATE_NAME`.

## Deployment

Deploy on Vercel and add the same environment variables there:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CANDIDATE_NAME`
- `LEAD_WEBHOOK_URL`

After deploying, submit one test lead from the live site to confirm Supabase and the webhook are both wired up.
