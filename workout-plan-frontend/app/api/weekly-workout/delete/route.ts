import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import WeeklyWorkoutPlanModel from "@/models/WeeklyWorkoutPlanModel";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { _id } = await request.json();

    if (!_id) {
      return NextResponse.json(
        { message: "Missing _id parameter." },
        { status: 400 }
      );
    }

    const deletedPlan = await WeeklyWorkoutPlanModel.findByIdAndDelete(_id);

    if (!deletedPlan) {
      return NextResponse.json({ message: "Plan not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Plan deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting plan:", error);
    return NextResponse.json(
      { message: "Error deleting plan." },
      { status: 500 }
    );
  }
}
