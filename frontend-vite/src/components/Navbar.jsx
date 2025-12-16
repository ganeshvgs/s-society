import { Link, useLocation } from "react-router-dom";
import {
  useUser,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { user } = useUser();
  const location = useLocation();
  const role = user?.publicMetadata?.role || null;
  const [open, setOpen] = useState(false);

  const isActive = (path) =>
    location.pathname === path
      ? "text-indigo-600 font-semibold"
      : "text-gray-700 hover:text-indigo-500";

  const closeMenu = () => setOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="px-4 md:px-6 py-3 flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="text-xl font-bold text-indigo-700">
          SBCCOS
        </Link>

        {/* DESKTOP LINKS */}
        <SignedIn>
          <div className="hidden lg:flex gap-6 items-center">
            {role === "admin" && (
              <>
                <NavLink to="/admin" isActive={isActive} />
                <NavLink to="/admin/add-member" isActive={isActive} label="Add Member" />
                <NavLink to="/admin/members" isActive={isActive} label="Members" />
                <NavLink to="/admin/add-loan" isActive={isActive} label="Add Loan" />
                <NavLink to="/admin/loan-applications" isActive={isActive} label="Loan Accounts" />
                <NavLink to="/admin/add-fd" isActive={isActive} label="Add FD" />
                <NavLink to="/admin/fixed-deposits" isActive={isActive} label="FDs" />
                <NavLink to="/admin/add-rd" isActive={isActive} label="Add RD" />
                <NavLink to="/admin/recurring-deposits" isActive={isActive} label="RDs" />
                <NavLink to="/admin/add-cd" isActive={isActive} label="Add CD" />
                <NavLink to="/admin/cds" isActive={isActive} label="CDs" />
                <NavLink to="/admin/add-share" isActive={isActive} label="Add Share" />
                <NavLink to="/admin/share-list" isActive={isActive} label="Shares" />
              </>
            )}

            {role === "member" && (
              <>
                <NavLink to="/member" isActive={isActive} />
                <NavLink to="/member/loan" isActive={isActive} label="My Loans" />
                <NavLink to="/member/fds" isActive={isActive} label="My FDs" />
                <NavLink to="/member/rds" isActive={isActive} label="My RDs" />
                <NavLink to="/member/cds" isActive={isActive} label="My CDs" />
                <NavLink to="/member/shares" isActive={isActive} label="My Shares" />
              </>
            )}
          </div>
        </SignedIn>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md text-sm">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          {/* MOBILE MENU BUTTON */}
          <button
            className="lg:hidden ml-2"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <SignedIn>
          <div className="lg:hidden bg-white border-t shadow-md px-4 py-4 space-y-3">
            {role === "admin" && (
              <>
                <MobileLink to="/admin" onClick={closeMenu} />
                <MobileLink to="/admin/add-member" label="Add Member" onClick={closeMenu} />
                <MobileLink to="/admin/members" label="Members" onClick={closeMenu} />
                <MobileLink to="/admin/add-loan" label="Add Loan" onClick={closeMenu} />
                <MobileLink to="/admin/loan-applications" label="Loan Accounts" onClick={closeMenu} />
                <MobileLink to="/admin/add-fd" label="Add FD" onClick={closeMenu} />
                <MobileLink to="/admin/fixed-deposits" label="FDs" onClick={closeMenu} />
                <MobileLink to="/admin/add-rd" label="Add RD" onClick={closeMenu} />
                <MobileLink to="/admin/recurring-deposits" label="RDs" onClick={closeMenu} />
                <MobileLink to="/admin/add-cd" label="Add CD" onClick={closeMenu} />
                <MobileLink to="/admin/cds" label="CDs" onClick={closeMenu} />
                <MobileLink to="/admin/add-share" label="Add Share" onClick={closeMenu} />
                <MobileLink to="/admin/share-list" label="Shares" onClick={closeMenu} />
              </>
            )}

            {role === "member" && (
              <>
                <MobileLink to="/member" onClick={closeMenu} />
                <MobileLink to="/member/loan" label="My Loans" onClick={closeMenu} />
                <MobileLink to="/member/fds" label="My FDs" onClick={closeMenu} />
                <MobileLink to="/member/rds" label="My RDs" onClick={closeMenu} />
                <MobileLink to="/member/cds" label="My CDs" onClick={closeMenu} />
                <MobileLink to="/member/shares" label="My Shares" onClick={closeMenu} />
              </>
            )}
          </div>
        </SignedIn>
      )}
    </nav>
  );
}

/* ================= HELPERS ================= */

const NavLink = ({ to, label, isActive }) => (
  <Link to={to} className={isActive(to)}>
    {label || "Dashboard"}
  </Link>
);

const MobileLink = ({ to, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block py-2 px-2 rounded text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
  >
    {label || "Dashboard"}
  </Link>
);
