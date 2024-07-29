"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

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

const Form1: React.FC = () => {
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState<FormData>({
    planOwner: "",
    planName: "",
    dateOfBirth: "",
    height: "",
    weight: "",
    weeklyActivities: [{ activity: "" }],
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleActivityChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const newWeeklyActivities = formData.weeklyActivities.map(
      (activity, idx) => {
        if (idx !== index) return activity;
        return { ...activity, activity: event.target.value };
      }
    );
    setFormData({ ...formData, weeklyActivities: newWeeklyActivities });
  };

  const addActivity = () => {
    setFormData({
      ...formData,
      weeklyActivities: [...formData.weeklyActivities, { activity: "" }],
    });
  };

  const removeActivity = (index: number) => {
    const newWeeklyActivities = formData.weeklyActivities.filter(
      (_, idx) => idx !== index
    );
    setFormData({ ...formData, weeklyActivities: newWeeklyActivities });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios
        .post("http://localhost:3000/api/form-submission", formData)
        .then((response) => {
          console.log(response.data);
        });
      console.log("Form data saved successfully!");
    } catch (error) {
      console.error("Error saving form data:", error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>You need to sign in to access this form.</div>;
  }
  useEffect(() => {
    console.log(session);
    if (session && session.user) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        planOwner: String(session.user?.email),
      }));
    }
  }, [session]);

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Personal Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Plan Name (Required)</label>
          <input
            type="text"
            name="planName"
            value={formData.planName}
            onChange={handleChange}
            className="w-full border px-2 py-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Date of Birth (Required)</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full border px-2 py-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Height (Required)</label>
          <input
            type="text"
            name="height"
            value={formData.height}
            onChange={handleChange}
            className="w-full border px-2 py-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Weight (Required)</label>
          <input
            type="text"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className="w-full border px-2 py-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Weekly Activities (Optional)</label>
          {formData.weeklyActivities.map((activity, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={activity.activity}
                onChange={(e) => handleActivityChange(index, e)}
                className="w-full border px-2 py-1 mr-2"
              />
              <button
                type="button"
                onClick={() => removeActivity(index)}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addActivity}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Activity
          </button>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form1;
