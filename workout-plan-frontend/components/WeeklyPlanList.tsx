"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { List, Card, message, Spin, Button, Modal, Descriptions } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
interface WeeklyActivity {
  activity: string;
  _id: string;
}

interface WorkoutPlan {
  _id: string;
  planOwner: string;
  responseContent: string;
  selectedGoal: string;
  planName: string;
  dateOfBirth: string;
  height: string;
  weight: string;
  weeklyActivities: WeeklyActivity[];
  createdAt: string;
}
interface WeeklyPlanListProps {
  refetchTrigger: boolean;
}

const WeeklyPlanList: React.FC<WeeklyPlanListProps> = ({ refetchTrigger }) => {
  const { data: session, status } = useSession();
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);

  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      setLoading(true);
      try {
        const response = await axios.post("/api/weekly-workout/queries", {
          planOwner: session?.user?.email,
        });
        // console.log(response.data);
        setWorkoutPlans(response.data.plans);
        setLoading(false);
      } catch (err) {
        setError("Failed to load workout plans.");
        setLoading(false);
        message.error("Failed to load workout plans.");
      }
    };
    if (session && session.user && session.user.email) {
      fetchWorkoutPlans();
    }
  }, [session, refetchTrigger]);

  const handleDelete = async (_id: string) => {
    try {
      await axios.post("/api/weekly-workout/delete", { _id });
      setWorkoutPlans(workoutPlans.filter((plan) => plan._id !== _id));
      message.success("Workout Plan Deleted");
    } catch (error) {
      console.error("Error deleting workout plan:", error);
    }
  };

  const showModal = (plan: WorkoutPlan) => {
    setSelectedPlan(plan);
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setSelectedPlan(null);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div style={{ padding: "0px" }}>
      <h2 className="text-xl mb-4">Saved Workout Plan</h2>
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={workoutPlans}
        renderItem={(plan) => (
          <List.Item>
            <Card
              title={plan.planName}
              extra={
                <>
                  <Button danger onClick={() => handleDelete(plan._id)}>
                    <DeleteOutlined />
                  </Button>
                </>
              }
              style={{
                width: "100%",
                maxWidth: "500px",
                cursor: "pointer",
                margin: "0 auto",
                padding: "2px",
                boxSizing: "border-box",
              }}
            >
              <button onClick={() => showModal(plan)}>
                <Descriptions>
                  <Descriptions.Item
                    label="Workout Goal"
                    span={3}
                    style={{ justifyContent: "start" }}
                  >
                    {plan.selectedGoal}
                  </Descriptions.Item>
                  <Descriptions.Item label="Height" span={3}>
                    {plan.height}
                  </Descriptions.Item>
                  <Descriptions.Item label="Weight" span={3}>
                    {plan.weight}
                  </Descriptions.Item>
                  <Descriptions.Item label="Date of Birth" span={3}>
                    {plan.dateOfBirth}
                  </Descriptions.Item>
                </Descriptions>
              </button>
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title={selectedPlan?.planName}
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        {selectedPlan && (
          <>
            <Descriptions bordered>
              <Descriptions.Item label="Created At" span={3}>
                {new Date(selectedPlan.createdAt).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Selected Goal" span={3}>
                {selectedPlan.selectedGoal}
              </Descriptions.Item>
              <Descriptions.Item label="Height">
                {selectedPlan.height}
              </Descriptions.Item>
              <Descriptions.Item label="Weight">
                {selectedPlan.weight}
              </Descriptions.Item>
              <Descriptions.Item label="Date of Birth">
                {selectedPlan.dateOfBirth}
              </Descriptions.Item>
              <Descriptions.Item label="Weekly Activities" span={3}>
                <ul>
                  {selectedPlan.weeklyActivities.map((activity) => (
                    <li key={activity._id}>{activity.activity}</li>
                  ))}
                </ul>
              </Descriptions.Item>
              <Descriptions.Item label="Generated Plan" span={3}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {selectedPlan.responseContent}
                </ReactMarkdown>
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>
    </div>
  );
};

export default WeeklyPlanList;
