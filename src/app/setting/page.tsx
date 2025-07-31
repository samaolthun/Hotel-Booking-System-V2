"use client";
import { useState } from "react";

export default function Setting() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailNotif, setEmailNotif] = useState(true);
  const [language, setLanguage] = useState("en");
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Setting</h1>
      <p>Manage your account settings here.</p>

      <div className="max-w-xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-xl font-bold mb-4">Change Password</h2>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
            placeholder="Old Password"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
            placeholder="New Password"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
            placeholder="Confirm New Password"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Save Changes
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-xl font-bold mb-4">Notifications</h2>
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={emailNotif}
              onChange={() => setEmailNotif(!emailNotif)}
              className="mr-2"
            />
            Email notifications for bookings and offers
          </label>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-xl font-bold mb-4">Language Preference</h2>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-2 border rounded text-black bg-white"
          >
            <option value="en">English</option>
            <option value="km">Khmer</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4 text-red-600">
            Delete Account
          </h2>
          <button
            onClick={() => setShowDelete(true)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete Account
          </button>
          {showDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-lg text-center">
                <p className="mb-4">
                  Are you sure you want to delete your account? This action
                  cannot be undone.
                </p>
                <button className="bg-red-500 text-white px-4 py-2 rounded mr-2">
                  Confirm Delete
                </button>
                <button
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setShowDelete(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
