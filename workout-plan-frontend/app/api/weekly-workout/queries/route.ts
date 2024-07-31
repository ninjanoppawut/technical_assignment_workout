"use server";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import WeeklyWorkoutPlanModel from "@/models/WeeklyWorkoutPlanModel";

export async function POST(request: Request) {
  try {
    await connectDB(); // Ensure the database connection is established

    const { planOwner } = await request.json(); // Extract planOwner from the request body
    if (!planOwner) {
      return NextResponse.json(
        { message: "planOwner is required" },
        { status: 400 }
      );
    }

    // Query the database for workout plans related to the planOwner
    const workoutPlans = await WeeklyWorkoutPlanModel.find({ planOwner });

    // In case of no plan for this user
    if (workoutPlans.length === 0) {
      return NextResponse.json(
        { message: "No workout plans found for this planOwner", plans: [] },
        { status: 200 }
      );
    }

    // Respond with the found workout plans
    return NextResponse.json(
      { message: "Workout plans retrieved successfully", plans: workoutPlans },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving workout plans:", error);

    // Respond with an error message and status code
    return NextResponse.json(
      { message: "Error retrieving workout plans." },
      { status: 500 }
    );
  }
}
