"use server";

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PlanQueriesModel from "@/models/PlansQueriesModel";

export async function POST(
  request: NextRequest,
  { params }: { params: { planOwner: string } }
) {
  const { planOwner } = params;

  if (!planOwner || typeof planOwner !== "string") {
    return NextResponse.json(
      { message: "Missing required params" },
      { status: 400 }
    );
  }

  await connectDB();

  try {
    const plan = await PlanQueriesModel.find({ planOwner: planOwner });
    if (!plan) {
      return NextResponse.json({ message: "Plan not found" }, { status: 404 });
    } else {
      return NextResponse.json({ message: "Success", plan }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error retrieving plan data." },
      { status: 500 }
    );
  }
}
