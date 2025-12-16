import { Outlet } from "react-router-dom";

export default function MemberLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}
