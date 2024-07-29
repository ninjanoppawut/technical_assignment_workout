import mongoose, { Document, Schema } from "mongoose";

interface WeeklyActivity {
  activity: string;
}

interface FormData extends Document {
  planOwner: string;
  planName: string;
  dateOfBirth: string;
  height: string;
  weight: string;
  weeklyActivities: WeeklyActivity[];
}

const FormDataSchema: Schema = new Schema({
  planOwner: { type: String, required: true },
  planName: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  height: { type: String, required: true },
  weight: { type: String, required: true },
  weeklyActivities: [{ activity: { type: String, required: false } }],
});

const FormDataModel =
  mongoose.models.FormData ||
  mongoose.model<FormData>("FormData", FormDataSchema);

export default FormDataModel;
