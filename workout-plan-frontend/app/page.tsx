"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Form1 from "@/components/Form1";
export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  const showSession = () => {
    if (status === "authenticated") {
      return;
      // return (
      //   <button
      //     className="border border-solid border-black rounded"
      //     onClick={() => {
      //       signOut({ redirect: false }).then(() => {
      //         router.push("/");
      //       });
      //     }}
      //   >
      //     Sign Out
      //   </button>
      // );
    } else if (status === "loading") {
      return <span className="text-[#888] text-sm mt-7">Loading...</span>;
    } else {
      router.push("/login");

      // return (
      //   <Link
      //     href="/login"
      //     className="border border-solid border-black rounded"
      //   >
      //     Sign In
      //   </Link>
      // );
    }
  };
  return (
    <div>
      {status === "authenticated" && <Navbar />}
      <main className="flex min-h-full flex-col justify-center">
        {status === "authenticated" && <Form1 />}
        {/* <h1 className="text-xl">Home</h1> */}
        {showSession()}
      </main>
    </div>
  );
}
