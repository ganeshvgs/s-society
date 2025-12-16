"use client";

import { User, Phone, Mail, Calendar, Home, X } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

export default function MemberProfileModal({ memberId, onClose }) {
  const { getToken } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!memberId) return;

    (async () => {
      const token = await getToken();
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/members/${memberId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(res.data);
    })();
  }, [memberId]);

  if (!profile) return null;

  const row = (Icon, value) => (
    <p className="flex items-center gap-2">
      <Icon size={16} /> {value || "-"}
    </p>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          <X />
        </button>

        <div className="flex gap-4 items-center">
          <img
            src={
              profile.photo ||
              `https://ui-avatars.com/api/?name=${profile.name}`
            }
            className="w-24 h-24 rounded-full border object-cover"
          />
          <div>
            <h2 className="text-xl font-bold">{profile.name}</h2>
            <p className="text-gray-500">{profile.role}</p>
          </div>
        </div>

        <div className="mt-5 space-y-2 text-sm text-gray-700">
          {row(User, profile.guardian)}
          {row(Phone, profile.phone)}
          {row(Mail, profile.email)}
          {row(
            Calendar,
            profile.dob &&
              new Date(profile.dob).toLocaleDateString("en-GB")
          )}
          {row(Home, profile.permanentAddress)}
        </div>
      </div>
    </div>
  );
}
