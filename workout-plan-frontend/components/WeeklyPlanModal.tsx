"use client";
import { useState, useEffect } from "react";
import { Card, Button, Modal, message } from "antd";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import axios from "axios";

interface WeeklyActivity {
  activity: string;
  _id: string;
}

interface WeeklyPlanModalProps {
  selectedGoal: string | null;
  planOwner: string;
  planName: string;
  dateOfBirth: string;
  height: string;
  weight: string;
  weeklyActivities: WeeklyActivity[];
  triggerRefetch: () => void;
}

const WeeklyPlanModal: React.FC<WeeklyPlanModalProps> = ({
  selectedGoal,
  planOwner,
  planName,
  dateOfBirth,
  height,
  weight,
  weeklyActivities,
  triggerRefetch,
}) => {
  const [responseContent, setResponseContent] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const promptTemplate = `Generate a WEEKLY workout plan based on the personal information including of Workout Goal ${selectedGoal} Plan Name:${planName}, Height:${height} (meter, centimeter), Weight:${weight} (kg), Weekly activities:${weeklyActivities
    .map((activity) => activity.activity)
    .join(
      ", "
    )}, Date of Birth:${dateOfBirth}. Give a brief answer not too long and also generate answer based on day of the week and format each day to be apart from other`;
  //Axios is not suitable for data streaming
  const fetchLLMResponse = async () => {
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

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        content += decoder.decode(value, { stream: true });
        setResponseContent(content);
      }

      setIsTyping(false);
    } catch (error) {
      console.error("Error fetching LLM response:", error);
      setIsTyping(false);
    }
  };
  const handleSubmitGenerateContent = async () => {
    const workoutPlanData = {
      planOwner: planOwner,
      planName: planName,
      responseContent: responseContent,
      selectedGoal: selectedGoal,
      dateOfBirth: dateOfBirth,
      height: height,
      weight: weight,
      weeklyActivities: weeklyActivities,
    };
    try {
      const response = await axios
        .post(`/api/weekly-workout/create`, workoutPlanData)
        .then((response) => {
          const workoutPlans = response.data;
          // console.log(workoutPlans);
          message.success("Workout plan saved!");
          setIsModalOpen(false);
          triggerRefetch();
        })
        .catch((error) => {
          message.error("Something wrong");
          console.log(error);
        });
    } catch (err) {
      console.log(err);
      // setError("Failed to load data");
    }
  };
  const showModal = () => {
    setIsModalOpen(true);
    fetchLLMResponse();
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setResponseContent("");
    setIsModalOpen(false);
  };
  const handleRegenerate = () => {
    fetchLLMResponse();
  };
  const handleSave = () => {
    if (responseContent) {
      handleSubmitGenerateContent();
    }
  };
  return (
    <div className="">
      <Button type="primary" onClick={showModal} disabled={!selectedGoal}>
        Generate Workout Plan
      </Button>
      <Modal
        title="Workout Plan"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <>
            {!isTyping && (
              <>
                <Button key="regenerate" onClick={handleRegenerate}>
                  Regenerate Answer
                </Button>
                <Button
                  key="save"
                  type="primary"
                  onClick={handleSave}
                  disabled={!responseContent}
                >
                  Save
                </Button>
              </>
            )}
          </>,
        ]}
      >
        {responseContent ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {responseContent}
          </ReactMarkdown>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </div>
  );
};

export default WeeklyPlanModal;
