import mongoose, { Document, Schema } from "mongoose";

interface WeeklyActivity {
  activity: string;
  _id: string;
}

interface WorkoutPlan extends Document {
  planOwner: string;
  responseContent: string;
  selectedGoal: string;
  planName: string;
  dateOfBirth: string;
  height: string;
  weight: string;
  weeklyActivities: WeeklyActivity[];
}

const weeklyWorkoutPlanSchema = new Schema<WorkoutPlan>(
  {
    planOwner: { type: String, required: true },
    responseContent: { type: String, required: true },
    selectedGoal: { type: String, required: true },
    planName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    height: { type: String, required: true },
    weight: { type: String, required: true },
    weeklyActivities: [{ activity: String, _id: String }],
  },
  { timestamps: true }
);

// Use the existing model if it exists, otherwise create a new one
export default mongoose.models.WeeklyWorkoutPlan ||
  mongoose.model<WorkoutPlan>("WeeklyWorkoutPlan", weeklyWorkoutPlanSchema);
