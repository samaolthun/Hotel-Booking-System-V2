import { Profile } from "@/components/profile/profile";

export default function ProfilePage() {
  return <Profile />;
}

// "use client";
// import { useState } from "react";

// const mockUser = {
//   profilePic: "/default-profile.png",
//   fullName: "John Doe",
//   email: "john@example.com",
//   phone: "012345678",
//   bookings: [
//     {
//       id: 1,
//       hotel: "Angkor Paradise",
//       checkin: "2025-08-01",
//       checkout: "2025-08-05",
//       status: "Completed",
//     },
//     {
//       id: 2,
//       hotel: "Phnom Penh Luxury",
//       checkin: "2025-09-10",
//       checkout: "2025-09-12",
//       status: "Upcoming",
//     },
//   ],
//   favorites: [
//     { id: 1, name: "Angkor Paradise" },
//     { id: 2, name: "Phnom Penh Luxury" },
//   ],
// };

// export default function Profile() {
//   const [user, setUser] = useState(mockUser);
//   const [editing, setEditing] = useState(false);
//   const [fullName, setFullName] = useState(user.fullName);
//   const [phone, setPhone] = useState(user.phone);

//   const handleSave = () => {
//     setUser({ ...user, fullName, phone });
//     setEditing(false);
//   };

//   const handleRemoveFavorite = (id: number) => {
//     setUser({ ...user, favorites: user.favorites.filter((f) => f.id !== id) });
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <div className="max-w-xl mx-auto">
//         <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col items-center">
//           <div className="relative">
//             <img
//               src={user.profilePic}
//               alt="Profile"
//               className="w-24 h-24 rounded-full object-cover border"
//             />
//             <button className="absolute bottom-0 right-0 bg-blue-500 text-white px-2 py-1 rounded text-xs">
//               Change
//             </button>
//           </div>
//           {editing ? (
//             <div className="w-full mt-4">
//               <input
//                 type="text"
//                 value={fullName}
//                 onChange={(e) => setFullName(e.target.value)}
//                 className="w-full p-2 mb-2 border rounded"
//                 placeholder="Full Name"
//               />
//               <input
//                 type="text"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 className="w-full p-2 mb-2 border rounded"
//                 placeholder="Phone Number"
//               />
//               <button
//                 onClick={handleSave}
//                 className="bg-green-500 text-white px-4 py-2 rounded mr-2"
//               >
//                 Save
//               </button>
//               <button
//                 onClick={() => setEditing(false)}
//                 className="bg-gray-300 px-4 py-2 rounded"
//               >
//                 Cancel
//               </button>
//             </div>
//           ) : (
//             <div className="w-full mt-4 text-center">
//               <h2 className="text-xl font-bold mb-1">{user.fullName}</h2>
//               <p className="text-gray-600 mb-1">{user.email}</p>
//               <p className="text-gray-600 mb-2">{user.phone}</p>
//               <button
//                 onClick={() => setEditing(true)}
//                 className="bg-blue-500 text-white px-4 py-2 rounded"
//               >
//                 Edit
//               </button>
//             </div>
//           )}
//         </div>

//         <div className="bg-white rounded-lg shadow p-4 mb-6">
//           <h3 className="font-semibold mb-2">Booking History</h3>
//           <ul>
//             {user.bookings.map((b) => (
//               <li
//                 key={b.id}
//                 className="border-b py-2 flex justify-between items-center"
//               >
//                 <div>
//                   <span className="font-medium">{b.hotel}</span>
//                   <span className="ml-2 text-sm text-gray-500">
//                     {b.checkin} - {b.checkout}
//                   </span>
//                 </div>
//                 <span
//                   className={`px-2 py-1 rounded text-xs ${
//                     b.status === "Completed"
//                       ? "bg-green-100 text-green-700"
//                       : "bg-yellow-100 text-yellow-700"
//                   }`}
//                 >
//                   {b.status}
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div className="bg-white rounded-lg shadow p-4">
//           <h3 className="font-semibold mb-2">Favorite Hotels</h3>
//           <ul className="flex flex-wrap gap-2">
//             {user.favorites.map((f) => (
//               <li
//                 key={f.id}
//                 className="bg-blue-50 px-3 py-1 rounded flex items-center"
//               >
//                 {f.name}
//                 <button
//                   onClick={() => handleRemoveFavorite(f.id)}
//                   className="ml-2 text-red-500 hover:text-red-700 text-xs"
//                   title="Remove"
//                 >
//                   ✕
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }
