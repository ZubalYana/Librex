import { NavLink } from "react-router-dom";
import CombinedLogo from "../ui/CombinedLogo";
import UsersList from "../ui/UsersList";

export default function AdminDashboard() {
  return (
    <div className="h-screen flex flex-col p-[20px] lg:px-[40px]">
      <div className="w-full flex justify-between items-center mb-6">
        <NavLink
          to="/app/books"
          className="hover:opacity-80 transition-opacity"
        >
          <CombinedLogo admin={true} />
        </NavLink>
      </div>
      <div className="w-full justify-between gap-x-6">
        <div className="w-[50%]">
          <h1 className="text-[20px] md:text-[24px] font-semibold mb-4 md:mb-6">
            Users:
          </h1>
          <UsersList />
        </div>
      </div>
    </div>
  );
}
