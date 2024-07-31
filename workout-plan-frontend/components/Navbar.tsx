"use client";

import { signOut, useSession } from "next-auth/react";
import { LogoutOutlined } from "@ant-design/icons";
import { Popover } from "antd";
import Link from "next/link";

function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-slate-700 p-2">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white">
          <p className="text-lg font-semibold">Workout Planner</p>
        </div>
        <div>
          {status === "loading" ? (
            <span className="text-gray-400">Loading...</span>
          ) : status === "authenticated" ? (
            <>
              <Popover content={"Sign out"}>
                <button
                  onClick={() => signOut({ redirect: false })}
                  className="text-white bg-red-500 px-4 py-1 rounded"
                >
                  <LogoutOutlined />
                </button>
              </Popover>
            </>
          ) : (
            <Link href="/login">
              <p className="text-white bg-blue-500 px-4 py-1 rounded">
                Sign In
              </p>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
