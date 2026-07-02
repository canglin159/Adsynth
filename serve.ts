// Production server for the built site. The TanStack Start build emits a portable
// fetch handler (dist/server/server.js) plus static client assets (dist/client);
// this wraps them in a Bun server on port 3000 — static files first, SSR for the
// rest. Run `bun run build` before starting. Restart it with `bun run publish`.
//
// Starting a new instance supersedes the old one: it kills the previously
// recorded pid and takes over the port, so `publish` never collides with the
// already-running server.
import handler from "./dist/server/server.js";

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? "0.0.0.0";
const CLIENT_DIR = `${import.meta.dir}/dist/client`;
const PID_FILE = `${import.meta.dir}/.team-site.pid`;

const prev = Number(await Bun.file(PID_FILE).text().catch(() => ""));
if (prev && prev !== process.pid) {
  try {
    process.kill(prev);
  } catch {
    // already gone
  }
  await Bun.sleep(500);
}
await Bun.write(PID_FILE, String(process.pid));

Bun.serve({
  port: PORT,
  hostname: HOST,
  async fetch(req) {
    const url = new URL(req.url);
    const { pathname } = url;

    // Stripe webhook — needs raw body for signature verification
    if (pathname === "/api/stripe-webhook" && req.method === "POST") {
      try {
        const body = await req.text();
        const signature = req.headers.get("stripe-signature") ?? "";
        const { handleWebhook } = await import("./dist/server/server.js") as any;

        // Try to import the webhook handler dynamically
        const { STRIPE_WEBHOOK_SECRET } = await import("./src/lib/env.ts");

        // Dynamically import stripe
        const Stripe = (await import("stripe")).default;
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
          apiVersion: "2025-03-01.basil",
        });

        let event;
        try {
          event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
        } catch (err) {
          const message = err instanceof Error ? err.message : "Invalid signature";
          return new Response(JSON.stringify({ error: message }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }

        // Process the event
        const { getUserByEmail, updateUserSubscription, createReferralCredit, getReferralByEmail, updateReferralStatus } = await import("./src/lib/env.ts" as any);

        // Import actual DB helpers at runtime
        const db = await import("./src/db/index.ts");

        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object;
            const customerEmail = session.customer_details?.email ?? session.customer_email;
            const customerId = session.customer as string;
            const tier = session.metadata?.tier ?? "starter";

            if (customerEmail) {
              const user = await db.getUserByEmail(customerEmail);
              if (user) {
                await db.updateUserSubscription(user.id, tier as any, customerId);
              }
            }
            break;
          }
          case "invoice.payment_succeeded": {
            const invoice = event.data.object;
            const customerId = invoice.customer as string;
            // Update user's subscription status based on invoice
            break;
          }
          case "customer.subscription.updated":
          case "customer.subscription.deleted": {
            const sub = event.data.object;
            const customerId = sub.customer as string;
            // Could update subscription status here
            break;
          }
        }

        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Internal error";
        return new Response(JSON.stringify({ error: message }), {
          status: 500,
          headers: { "content-type": "application/json" },
        });
      }
    }

    if (pathname !== "/") {
      const file = Bun.file(CLIENT_DIR + pathname);
      if (await file.exists()) return new Response(file);
    }
    return (
      handler as { fetch: (r: Request) => Response | Promise<Response> }
    ).fetch(req);
  },
});

console.log(`team-site serving on http://${HOST}:${String(PORT)}`);
