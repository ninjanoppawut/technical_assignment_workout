"use server";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import FormDataModel from "@/models/FormDataModel"; // Import your model

// Define the form data interface
interface WeeklyActivity {
  activity: string;
}

interface FormData {
  planOwner: string;
  planName: string;
  dateOfBirth: string;
  height: string;
  weight: string;
  weeklyActivities: WeeklyActivity[];
}

export async function POST(request: Request) {
  try {
    // Connect to the database
    await connectDB();

    // Parse the request body
    const formData = await request.json();
    // console.log("Received formData:", formData);
    if (
      !formData.planOwner ||
      !formData.planName ||
      !formData.height ||
      !formData.dateOfBirth ||
      !formData.weight
    ) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }
    // Save the form data to the database
    const newFormData = new FormDataModel(formData);
    // console.log("Prepared newFormData:", newFormData);
    await newFormData.save();

    // Return a success response
    return NextResponse.json(
      { message: "Form data saved successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving form data:", error);
    return NextResponse.json(
      { message: "Error saving form data." },
      { status: 500 }
    );
  }
}
