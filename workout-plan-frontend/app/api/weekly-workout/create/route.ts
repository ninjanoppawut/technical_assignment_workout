"use server";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import WeeklyWorkoutPlanModel from "@/models/WeeklyWorkoutPlanModel";

export async function POST(request: Request) {
  try {
    await connectDB();

    const workoutPlanData = await request.json();
    // console.log("workoutPlanData", workoutPlanData);

    // Create a new document using the imported model
    const newWorkoutPlan = new WeeklyWorkoutPlanModel(workoutPlanData);
    // console.log("newWorkoutPlan", newWorkoutPlan);
    await newWorkoutPlan.save();

    // Respond with success
    return NextResponse.json(
      { message: "Form data saved successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving form data:", error);

    // Respond with an error
    return NextResponse.json(
      { message: "Error saving form data." },
      { status: 500 }
    );
  }
}
