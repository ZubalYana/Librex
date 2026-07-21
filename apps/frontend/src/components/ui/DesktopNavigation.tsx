import CombinedLogo from "./CombinedLogo";
import { UserCircle2 } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function DesktopNavigation() {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `pb-1 transition-all duration-200 border-b-2 ${
      isActive
        ? "border-navy text-navy font-medium" 
        : "border-transparent text-navy/70 hover:text-navy hover:border-navy/40"
    }`;

  return (
    <div className="w-full flex justify-between items-center">
      
      <NavLink to="/app/books" className="hover:opacity-80 transition-opacity">
        <CombinedLogo />
      </NavLink>

      <div className="gap-x-6 text-navy hidden md:flex">
        <NavLink to="/app/books" className={navLinkClass}>
          All Books
        </NavLink>
        
        <NavLink to="/app/me/books" className={navLinkClass}>
          My books
        </NavLink>
      </div>

      <NavLink
        to="/app/me"
        className={({ isActive }) =>
          `transition-colors duration-200 hidden md:flex ${
            isActive ? "text-navy" : "text-navy/60 hover:text-navy"
          }`
        }
      >
        <UserCircle2 />
      </NavLink>
      
    </div>
  );
}