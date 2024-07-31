"use client";
import { useState } from "react";
import { Card, Row, Col, Button, Select, message } from "antd";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import WeeklyPlanModal from "./WeeklyPlanModal";
const { Option } = Select;

interface WeeklyActivity {
  activity: string;
  _id: string;
}

interface Plan {
  _id: string;
  planName: string;
  height: string;
  dateOfBirth: string;
  weight: string;
  weeklyActivities: WeeklyActivity[];
  handleDelete: (id: string) => void;
}

const PlanCard: React.FC<Plan> = ({
  _id,
  planName,
  dateOfBirth,
  height,
  weight,
  weeklyActivities,
  handleDelete,
}) => {
  const [responseContent, setResponseContent] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [workoutGoals, setWorkoutGoals] = useState<string[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  async function deletePlanList(id: String) {
    try {
      const response = await axios
        .post(`${process.env.NEXT_PUBLIC_URL}/api/plans/delete/${id}`)
        .then((response) => {
          console.log(response.data);
          handleDelete(_id);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      //   setError("Failed to load data");
    }
  }

  const promptTemplate = `Generate a workout goal based on the personal information including of Plan Name:${planName}+ Height:${height} (meter, centimeter)+ Weight:${weight} (kg)+ Weekly activities of ${weeklyActivities
    .map((activity) => activity.activity)
    .join(
      ", "
    )}+ Date of Birth${dateOfBirth}. Give a list of 5 goals only with no other details.`;

  const fetchLLMResponse = async () => {
    setSelectedGoal(null);
    setWorkoutGoals([]);
    setIsTyping(true);
    try {
      const response = await fetch("/api/llm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: promptTemplate,
        }),
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let content = "";
      let goals = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        content += decoder.decode(value, { stream: true });
        setResponseContent(content);

        // Assuming each goal is separated by a newline or period
        goals = content.split("\n").filter((goal) => goal.trim() !== "");
        setWorkoutGoals(goals);
      }

      setIsTyping(false);
    } catch (error) {
      console.error("Error fetching LLM response:", error);
      setIsTyping(false);
    }
  };

  const handleGoalSelect = (goal: string) => {
    setSelectedGoal(goal);
    message.success(`Selected Goal: ${goal}`);
  };

  return (
    <Card className="min-w-full">
      <h1 className="font-bold text-xl">Personal Information</h1>
      <h2>Plan Name: {planName}</h2>
      <p>{dateOfBirth}</p>
      <p>Height: {height}</p>
      <p>Weight: {weight}</p>
      <h3>Weekly Activities</h3>
      <ul>
        {weeklyActivities.map((activity) => (
          <li key={activity._id}>{activity.activity}</li>
        ))}
      </ul>
      <div>
        {/* {responseContent ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {responseContent}
          </ReactMarkdown>
        ) : (
          <p>Loading</p>
        )} */}
      </div>
      {workoutGoals.length > 0 && (
        <div>
          <h3>Select a Workout Goal:</h3>
          <Select
            style={{ width: "100%" }}
            placeholder="Select a goal"
            onChange={handleGoalSelect}
          >
            {workoutGoals.map((goal, index) => (
              <Option key={index} value={goal}>
                {goal}
              </Option>
            ))}
          </Select>
          {/* {selectedGoal && <p>Selected Goal: {selectedGoal}</p>} */}
        </div>
      )}
      {!isTyping && (
        <>
          <Row justify="space-between" style={{ marginTop: "10px" }}>
            <WeeklyPlanModal
              selectedGoal={selectedGoal}
              planName={planName}
              dateOfBirth={dateOfBirth}
              height={height}
              weight={weight}
              weeklyActivities={weeklyActivities}
            />
            <div className="flex flex-row gap-4">
              <Button onClick={(e: any) => fetchLLMResponse()}>
                {workoutGoals
                  ? "Regenerate workout goal"
                  : " Generate Workout Goal"}
              </Button>
              <Button danger onClick={(e: any) => deletePlanList(_id)}>
                Delete
              </Button>
            </div>
          </Row>
        </>
      )}
    </Card>
  );
};

export default PlanCard;
