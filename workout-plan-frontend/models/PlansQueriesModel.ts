import mongoose, { Document, Schema, Model } from "mongoose";

interface WeeklyActivity {
  activity: string;
  _id: mongoose.Types.ObjectId;
}

interface Plan extends Document {
  _id: mongoose.Types.ObjectId;
  planOwner: string;
  planName: string;
  dateOfBirth: string;
  height: string;
  weight: string;
  weeklyActivities: WeeklyActivity[];
}

const PlanSchema: Schema<Plan> = new Schema(
  {
    planOwner: { type: String, required: true },
    planName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    height: { type: String, required: true },
    weight: { type: String, required: true },
    weeklyActivities: [{ activity: String, _id: Schema.Types.ObjectId }],
  },
  { collection: "formdatas" }
);

const PlanQueriesModel: Model<Plan> =
  mongoose.models.Plan || mongoose.model<Plan>("Plan", PlanSchema);

export default PlanQueriesModel;
