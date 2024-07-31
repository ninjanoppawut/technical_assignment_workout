"use server";

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PlanQueriesModel from "@/models/PlansQueriesModel";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { message: "Missing required params" },
      { status: 400 }
    );
  }

  await connectDB();

  try {
    const plan = await PlanQueriesModel.findByIdAndDelete({ _id: id });
    if (!plan) {
      return NextResponse.json(
        { message: "Failed to Delete" },
        { status: 404 }
      );
    } else {
      return NextResponse.json(
        { message: "Delete Successfully", plan },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json({ message: "Error From Server" }, { status: 500 });
  }
}
