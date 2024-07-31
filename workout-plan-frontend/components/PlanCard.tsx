"use client";
import { useState } from "react";
import { Card, Row, Col, Button, Select, message, Descriptions } from "antd";
import axios from "axios";
import WeeklyPlanModal from "./WeeklyPlanModal";
import { DeleteOutlined } from "@ant-design/icons";
const { Option } = Select;

interface WeeklyActivity {
  activity: string;
  _id: string;
}

interface Plan {
  _id: string;
  planOwner: string;
  planName: string;
  height: string;
  dateOfBirth: string;
  weight: string;
  weeklyActivities: WeeklyActivity[];
  handleDelete: (id: string) => void;
  triggerRefetch: () => void;
}

const PlanCard: React.FC<Plan> = ({
  _id,
  planOwner,
  planName,
  dateOfBirth,
  height,
  weight,
  weeklyActivities,
  handleDelete,
  triggerRefetch,
}) => {
  const [responseContent, setResponseContent] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [workoutGoals, setWorkoutGoals] = useState<string[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  async function deletePlanList(id: String) {
    try {
      const response = await axios
        .post(`/api/plans/delete/${id}`)
        .then((response) => {
          // console.log(response.data);
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
    )}+ Date of Birth${dateOfBirth}. Give a list of 5 goals only with no other details. do not give the number in front of list`;

  const fetchLLMResponse = async () => {
    setSelectedGoal(null);
    setWorkoutGoals([]);
    setIsTyping(true);
    //Fetch Streaming Response
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
    message.success(`Workout Goal: ${goal}`);
  };

  return (
    <Card className="min-w-full">
      <Descriptions title="Personal Information">
        <Descriptions.Item label="Plan Name" span={3}>
          {planName}
        </Descriptions.Item>
        <Descriptions.Item label="Date of Birth" span={3}>
          {dateOfBirth}
        </Descriptions.Item>
        <Descriptions.Item label="Height" span={3}>
          {height + " " + "cm"}
        </Descriptions.Item>
        <Descriptions.Item label="Weight" span={3}>
          {weight + " " + "kg"}
        </Descriptions.Item>
        <Descriptions.Item label="Weekly Activities" span={6}>
          <div className="flex flex-row">
            {weeklyActivities.map((activity) => (
              <div className="ml-2" key={activity._id}>
                {activity.activity}
              </div>
            ))}
          </div>
        </Descriptions.Item>
        {workoutGoals.length > 0 ? (
          <Descriptions.Item label="Workout Goal">
            {" "}
            <Select
              loading={isTyping}
              style={{ width: "100%" }}
              placeholder="Select a goal"
              onChange={handleGoalSelect}
              dropdownStyle={{ width: "680px" }}
            >
              {workoutGoals.map((goal, index) => (
                <Option key={index} value={goal}>
                  {goal}
                </Option>
              ))}
            </Select>
          </Descriptions.Item>
        ) : (
          <>
            <Descriptions.Item label="Workout Goal">No Data</Descriptions.Item>
          </>
        )}
      </Descriptions>
      <>
        <Row justify="space-between" style={{ marginTop: "10px" }}>
          <WeeklyPlanModal
            triggerRefetch={triggerRefetch}
            selectedGoal={selectedGoal}
            planOwner={planOwner}
            planName={planName}
            dateOfBirth={dateOfBirth}
            height={height}
            weight={weight}
            weeklyActivities={weeklyActivities}
          />
          <div className="flex flex-row gap-4">
            <Button
              disabled={isTyping}
              onClick={(e: any) => fetchLLMResponse()}
            >
              {workoutGoals && "Suggest Goal"}
            </Button>
            <Button
              disabled={isTyping}
              danger
              onClick={(e: any) => deletePlanList(_id)}
            >
              <DeleteOutlined />
            </Button>
          </div>
        </Row>
      </>
    </Card>
  );
};

export default PlanCard;
