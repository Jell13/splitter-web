import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payloadString = await request.text();
    const svixHeaders = {
      "svix-id": request.headers.get("svix-id")!,
      "svix-timestamp": request.headers.get("svix-timestamp")!,
      "svix-signature": request.headers.get("svix-signature")!,
    };

    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("CLERK_WEBHOOK_SECRET not set");
    }

    const wh = new Webhook(webhookSecret);
    let event: any;
    try {
      event = wh.verify(payloadString, svixHeaders);
    } catch (err) {
      console.error("Webhook verification failed", err);
      return new Response("Invalid signature", { status: 400 });
    }

    if (event.type === "user.created") {
        console.log(event.data)
      const { id, first_name, last_name, email_addresses } = event.data;
      const name = [first_name, last_name].filter(Boolean).join(" ") || "New user";
      const email = email_addresses?.[0]?.email_address ?? "";

      await ctx.runMutation(internal.users.createFromClerk, {
        userId: id,
        name,
        email,
      });
    }

    if (event.type === "user.deleted"){
        const { id } = event.data;
        await ctx.runMutation(internal.users.deleteFromClerk, { userId: id });
    }

    return new Response(null, { status: 200 });
  }),
});

export default http;