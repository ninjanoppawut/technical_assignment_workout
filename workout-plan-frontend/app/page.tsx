"use client";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import PlanList from "@/components/PlanList";
import WeeklyPlanList from "@/components/WeeklyPlanList";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Form1 from "@/components/Form1";
export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hasPersonalData, setHasPersonalData] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(false);
  const handlePersonalData = (exists: boolean) => {
    setHasPersonalData(exists);
  };
  const triggerRefetch = () => {
    setRefetchTrigger(!refetchTrigger);
  };
  const showSession = () => {
    if (status === "authenticated") {
      return;
    } else if (status === "loading") {
      return <span className="text-[#888] text-sm mt-7">Loading...</span>;
    } else {
      router.push("/login");
    }
  };
  return (
    <div className="h-screen">
      <nav>{status === "authenticated" && <Navbar />}</nav>
      <main className="flex flex-col h-screen">
        <div className="flex flex-row flex-grow w-full">
          <div className="flex-grow-0 w-1/2 p-4">
            {status === "authenticated" && !hasPersonalData && (
              <Form1 hasPersonalData={handlePersonalData} />
            )}
            {status === "authenticated" && (
              <PlanList
                hasPersonalData={handlePersonalData}
                triggerRefetch={triggerRefetch}
              />
            )}
          </div>
          <div className="flex-grow-0 w-1/2 p-4 max-h-screen overflow-auto">
            {status === "authenticated" && (
              <WeeklyPlanList refetchTrigger={refetchTrigger} />
            )}
          </div>
        </div>
        {showSession()}
      </main>
    </div>
  );
}
