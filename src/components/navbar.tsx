import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-primary text-white px-4 py-2 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <img
          src="/default-profile.png"
          alt="User"
          className="w-8 h-8 rounded-full"
        />
        <span className="font-bold">John Doe</span>
      </div>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="px-4 py-2 rounded bg-primary hover:bg-primary/80"
        >
          ▼
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-10">
            <Link href="/profile" legacyBehavior>
              <a className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Profile
              </a>
            </Link>
            <Link href="/setting" legacyBehavior>
              <a className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Setting
              </a>
            </Link>
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => alert("Logged out!")}
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default function Profile() {
  return <div>Profile Page</div>;
}
