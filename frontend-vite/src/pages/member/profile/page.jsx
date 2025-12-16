"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import {
  Mail,
  Phone,
  Calendar,
  Home,
  Briefcase,
  User,
  Wallet,
  PiggyBank,
  Landmark,
  Coins,
} from "lucide-react";

export default function UserProfile() {
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();

  const [profile, setProfile] = useState(null);
  const [loans, setLoans] = useState([]);
  const [rds, setRds] = useState([]);
  const [fds, setFds] = useState([]);
  const [cds, setCds] = useState([]);
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const headers = { Authorization: `Bearer ${token}` };

      const [
        profileRes,
        loanRes,
        rdRes,
        fdRes,
        cdRes,
        shareRes,
      ] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/members/${user.id}`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/loans/${user.id}`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/rd/member/${user.id}`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/fd/member/${user.id}`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/cd/member/${user.id}`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/share/${user.id}`, { headers }),
      ]);

      setProfile(profileRes.data);
      setLoans(Array.isArray(loanRes.data) ? loanRes.data : []);
      setRds(rdRes.data?.rdAccounts || rdRes.data || []);
      setFds(Array.isArray(fdRes.data) ? fdRes.data : []);
      setCds(Array.isArray(cdRes.data) ? cdRes.data : []);
      setShares(
        shareRes.data?.shareAccount ? [shareRes.data.shareAccount] : []
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) fetchAll();
  }, [isLoaded, user]);

  if (!isLoaded || loading)
    return <p className="p-6 text-center">Loading profile...</p>;

  if (!profile)
    return <p className="p-6 text-center text-red-500">Profile not found</p>;

  /* ===== Calculations ===== */
  const totalLoan = loans.reduce((a, l) => a + (l.loanAmount || 0), 0);
  const totalRD = rds.reduce(
    (a, r) => a + (r.availableBalance || r.totalDeposited || 0),
    0
  );
  const activeFDs = fds.filter((f) => f.status !== "Closed");
  const totalFD = activeFDs.reduce((a, f) => a + (f.principal || 0), 0);
  const totalCD = cds.reduce((a, c) => a + (c.balance || 0), 0);
  const totalShares = shares.reduce(
    (a, s) => a + (s.currentAmountBalance || s.totalAmount || 0),
    0
  );

  return (
    <div className="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto space-y-6">

      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 sm:p-6 text-white flex flex-col sm:flex-row gap-4 items-center">
        <img
          src={
            profile.photo ||
            `https://ui-avatars.com/api/?name=${profile.name}&size=256`
          }
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-lg object-cover"
          alt="Profile"
        />

        <div className="text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold">{profile.name}</h2>
          <p className="opacity-90 capitalize text-sm sm:text-base">
            {profile.role}
          </p>
          <p className="text-xs sm:text-sm mt-1">
            Society No: <b>{profile.societyNumber}</b>
          </p>
        </div>
      </div>

      {/* ================= BASIC INFO ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <InfoCard title="Contact">
          <Info icon={Mail} label="Email" value={profile.email} />
          <Info icon={Phone} label="Phone" value={profile.phone || "N/A"} />
        </InfoCard>

        <InfoCard title="Personal">
          <Info
            icon={Calendar}
            label="DOB"
            value={
              profile.dob
                ? new Date(profile.dob).toLocaleDateString("en-GB")
                : "N/A"
            }
          />
          <Info icon={User} label="Guardian" value={profile.guardian || "N/A"} />
        </InfoCard>

        <InfoCard title="Occupation">
          <Info
            icon={Briefcase}
            label="Type"
            value={profile.occupationType || "N/A"}
          />
          <Info label="Employer" value={profile.employerName || "N/A"} />
        </InfoCard>
      </div>

      {/* ================= FINANCIAL SUMMARY ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Stat icon={Wallet} label="Loans" value={totalLoan} />
        <Stat icon={PiggyBank} label="RD Balance" value={totalRD} />
        <Stat icon={Landmark} label="FD Amount" value={totalFD} />
        <Stat icon={Coins} label="CD Balance" value={totalCD} />
        <Stat icon={Coins} label="Shares" value={totalShares} />
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

const InfoCard = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow border p-4">
    <h3 className="font-semibold text-indigo-700 mb-2 text-sm sm:text-base">
      {title}
    </h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const Info = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 text-sm">
    {Icon && <Icon className="w-4 h-4 text-gray-500 shrink-0" />}
    <span className="font-medium text-gray-600">{label}:</span>
    <span className="font-semibold text-gray-800 break-words">
      {value}
    </span>
  </div>
);

const Stat = ({ icon: Icon, label, value }) => (
  <div className="bg-gradient-to-br from-gray-50 to-gray-100 border rounded-xl p-4 text-center shadow">
    <Icon className="w-6 h-6 mx-auto text-indigo-600 mb-2" />
    <p className="text-xs sm:text-sm text-gray-500">{label}</p>
    <p className="text-base sm:text-lg font-bold text-gray-800">
      ₹{Math.round(value).toLocaleString("en-IN")}
    </p>
  </div>
);
