"use client";
import { useState, useEffect } from "react";
import { Card, Button, Modal } from "antd";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface WeeklyActivity {
  activity: string;
  _id: string;
}

interface WeeklyPlanModalProps {
  selectedGoal: string | null;
  planName: string;
  dateOfBirth: string;
  height: string;
  weight: string;
  weeklyActivities: WeeklyActivity[];
}

const WeeklyPlanModal: React.FC<WeeklyPlanModalProps> = ({
  selectedGoal,
  planName,
  dateOfBirth,
  height,
  weight,
  weeklyActivities,
}) => {
  const [responseContent, setResponseContent] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const promptTemplate = `Generate a WEEKLY workout plan based on the personal information including of Workout Goal ${selectedGoal} Plan Name:${planName}, Height:${height} (meter, centimeter), Weight:${weight} (kg), Weekly activities:${weeklyActivities
    .map((activity) => activity.activity)
    .join(
      ", "
    )}, Date of Birth:${dateOfBirth}. Give a brief answer not too long and also generate answer based on day of the week and format each day to be apart from other`;

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
      // Implement save functionality here
      console.log("Save functionality not implemented yet.");
    }
  };
  return (
    <div className="">
      <Button type="primary" onClick={showModal}>
        Generate Workout Plan
      </Button>
      <Modal
        title="Workout Plan"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="regenerate" onClick={handleRegenerate}>
            Regenerate Answer
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={handleSave}
            disabled={!responseContent}
          >
            Save
          </Button>,
          // <Button key="cancel" onClick={handleCancel}>
          //   Cancel
          // </Button>,
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
