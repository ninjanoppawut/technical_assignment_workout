"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PlanCard from "./PlanCard";
import axios from "axios";
interface WeeklyActivity {
  activity: string;
  _id: string;
}

interface PersonalData {
  _id: string;
  planOwner: string;
  planName: string;
  dateOfBirth: string;
  height: string;
  weight: string;
  weeklyActivities: WeeklyActivity[];
}
interface PersonalDataListProps {
  hasPersonalData: (exists: boolean) => void;
}
function PlanList({ hasPersonalData }: PersonalDataListProps) {
  const { data: session, status } = useSession();
  const [plan, setPlan] = useState<PersonalData[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function fetchPlanList() {
    const email = session?.user?.email;
    try {
      const response = await axios
        .post(`${process.env.NEXT_PUBLIC_URL}/api/plans/queries/${email}`)
        .then((response) => {
          const plans = response.data.plan;
          console.log(plans);
          setPlan(plans);
          hasPersonalData(plans.length > 0);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      setError("Failed to load data");
    }
  }

  const handleDelete = (id: string) => {
    const updatedPlans = plan.filter((plan) => plan._id !== id);
    setPlan(updatedPlans);
    hasPersonalData(updatedPlans.length > 0);
  };
  useEffect(() => {
    if (session && session.user && session.user.email) {
      fetchPlanList();
    }
  }, [session, hasPersonalData]);
  if (error) return <div>{error}</div>;
  if (!plan) return <div>Loading...</div>;
  return (
    <div>
      <div className="flex flex-row overflow-x-auto gap-6">
        {plan.map((item) => (
          <PlanCard key={item._id} {...item} handleDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}

export default PlanList;
