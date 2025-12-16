import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";

import RequireAdmin from "./auth/RequireAdmin";
import RequireMember from "./auth/RequireMember";

// Admin
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/page";
import AddMember from "./pages/admin/add-member/page";
import MembersList from "./pages/admin/members-list/page";
import AddLoan from "./pages/admin/add-loan/page";
import LoanApplications from "./pages/admin/loans-list/page";
import AddFd from "./pages/admin/add-fd/page";
import FdList from "./pages/admin/fd-list/page";
import AddRd from "./pages/admin/add-rd/page";
import RdList from "./pages/admin/rd-list/page";
import AddCd from "./pages/admin/add-cd/page";
import CdList from "./pages/admin/cd-list/page";
import AddShare from "./pages/admin/add-share/page";
import ShareList from "./pages/admin/share-list/page";

// Member

import MemberLayout from "./pages/member/MemberLayout";
import MemberDashboard from "./pages/member/page";
import MemberProfile from "./pages/member/profile/page";
import MemberCdList from "./pages/member/cd-list/page";
import MemberFdList from "./pages/member/fd-list/page";
import MemberLoan from "./pages/member/loan/page";
import MemberRdList from "./pages/member/rd-list/page";
import MemberShares from "./pages/member/shares/page";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Landing />} />

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="add-member" element={<AddMember />} />
          <Route path="members" element={<MembersList />} />
          <Route path="add-loan" element={<AddLoan />} />
          <Route path="loan-applications" element={<LoanApplications />} />
          <Route path="add-fd" element={<AddFd />} />
          <Route path="fixed-deposits" element={<FdList />} />
          <Route path="add-rd" element={<AddRd />} />
          <Route path="recurring-deposits" element={<RdList />} />
          <Route path="add-cd" element={<AddCd />} />
          <Route path="cds" element={<CdList />} />
          <Route path="share-list" element={<ShareList />} />
          <Route path="add-share" element={<AddShare />} />

        </Route>

        {/* ================= MEMBER ROUTES ================= */}
        <Route
          path="/member"
          element={
            <RequireMember>
              <MemberLayout />
            </RequireMember>
          }
        >
          <Route index element={<MemberDashboard />} />
          <Route path="profile" element={<MemberDashboard />} />
          <Route path="cds" element={<MemberCdList />} />
          <Route path="fds" element={<MemberFdList />} />
          <Route path="loan" element={<MemberLoan />} />
          <Route path="rds" element={<MemberRdList />} />
          <Route path="shares" element={<MemberShares />} />

        </Route>

        <Route path="/unauthorized" element={<h1>Unauthorized</h1>} />
      </Routes>
    </>
  );
}
