// app/api/test-db-connection/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";

export const GET = async (req: NextRequest) => {
  try {
    const isConnected = await connectDB();
    if (isConnected) {
      return NextResponse.json(
        { message: "Successfully connected to the database." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Failed to connect to the database." },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error connecting to the database.", error },
      { status: 500 }
    );
  }
};
