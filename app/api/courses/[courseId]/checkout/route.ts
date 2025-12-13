import { db } from "@/lib/db";
import { courses, purchases, stripeCustomers } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const user = await currentUser();
    const { courseId } = await params;

    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const [course] = await db
      .select()
      .from(courses)
      .where(and(eq(courses.id, courseId), eq(courses.isPublished, true)))
      .limit(1);

    const [purchase] = await db
      .select()
      .from(purchases)
      .where(
        and(eq(purchases.userId, user.id), eq(purchases.courseId, courseId))
      )
      .limit(1);

    if (purchase) {
      return new NextResponse("Already Purchased", { status: 400 });
    }

    if (!course) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const coursePrice = course.price ? parseFloat(course.price) : 0;

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: course.title,
          },
          unit_amount: Math.round(coursePrice * 100),
        },
        quantity: 1,
      },
    ];

    const [stripeCustomer] = await db
      .select({ stripeCustomerId: stripeCustomers.stripeCustomerId })
      .from(stripeCustomers)
      .where(eq(stripeCustomers.userId, user.id))
      .limit(1);

    let customerId: string;

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses?.[0]?.emailAddress,
      });

      const [newStripeCustomer] = await db
        .insert(stripeCustomers)
        .values({
          userId: user.id,
          stripeCustomerId: customer.id,
        })
        .returning();

      customerId = newStripeCustomer.stripeCustomerId;
    } else {
      customerId = stripeCustomer.stripeCustomerId;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
      metadata: {
        courseId: course.id,
        userId: user.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.log("COURSE_ID_CHECKOUT", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
