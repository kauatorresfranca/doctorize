import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import db from "@/db";
import { usersTable } from "@/db/schema";

export const POST = async (request: Request) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error("Stripe secret key not found");
    }
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      throw new Error("Stripe signature not found");
    }
    const text = await request.text();
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-05-28.basil",
    });
    const event = stripe.webhooks.constructEvent(
      text,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    console.log("Received event type:", event.type);

    switch (event.type) {
      case "customer.subscription.created": {
        console.log("Processing customer.subscription.created event");
        const subscription = event.data.object as Stripe.Subscription;
        console.log(
          "Subscription data:",
          JSON.stringify(subscription, null, 2),
        );

        const userId = subscription.metadata.userId;
        console.log("User ID from metadata:", userId);

        if (!userId) {
          throw new Error("User ID not found in subscription metadata");
        }

        console.log("Updating database for user:", userId);
        await db
          .update(usersTable)
          .set({
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            plan: "essential",
          })
          .where(eq(usersTable.id, userId));
        console.log("Database updated successfully");
        break;
      }
      case "customer.subscription.deleted": {
        console.log("Processing customer.subscription.deleted event");
        const subscription = event.data.object as Stripe.Subscription;

        const userId = subscription.metadata.userId;
        if (!userId) {
          throw new Error("User ID not found in subscription metadata");
        }

        console.log("Removing subscription for user:", userId);
        await db
          .update(usersTable)
          .set({
            stripeSubscriptionId: null,
            stripeCustomerId: null,
            plan: null,
          })
          .where(eq(usersTable.id, userId));
        console.log("Database updated successfully");
      }
    }
    return NextResponse.json({
      received: true,
    });
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return new NextResponse(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      {
        status: 500,
      },
    );
  }
};
