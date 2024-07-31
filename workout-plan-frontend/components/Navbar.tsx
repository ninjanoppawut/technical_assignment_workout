"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white">
          <Link href="/">
            <p className="text-lg font-semibold">Workout Planner</p>
          </Link>
        </div>
        <div>
          {status === "loading" ? (
            <span className="text-gray-400">Loading...</span>
          ) : status === "authenticated" ? (
            <>
              {/* <Link href="/profile">
                <p className="text-white mr-4">Profile</p>
              </Link> */}
              <button
                onClick={() => signOut({ redirect: false })}
                className="text-white bg-red-500 px-4 py-2 rounded"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/login">
              <p className="text-white bg-blue-500 px-4 py-2 rounded">
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
