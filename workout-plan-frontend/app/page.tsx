"use client";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import PlanList from "@/components/PlanList";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Form1 from "@/components/Form1";
export default function Home() {
  const { status } = useSession();
  const router = useRouter();
  const [hasPersonalData, setHasPersonalData] = useState(false);
  const handlePersonalData = (exists: boolean) => {
    setHasPersonalData(exists);
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
    <div>
      {status === "authenticated" && <Navbar />}
      <main className="flex min-h-full flex-col justify-center">
        {status === "authenticated" && !hasPersonalData && (
          <Form1 hasPersonalData={handlePersonalData} />
        )}
        {status === "authenticated" && (
          <PlanList hasPersonalData={handlePersonalData} />
        )}
        {/* <h1 className="text-xl">Home</h1> */}
        {showSession()}
      </main>
    </div>
  );
}
