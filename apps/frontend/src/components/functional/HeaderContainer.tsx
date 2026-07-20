import DesktopNavigation from "../ui/DesktopNavigation";

export default function HeaderContainer({ children }) {
  return (
    <div className="h-screen flex flex-col p-[20px] lg:px-[40px]">
      <DesktopNavigation />
      <div className="flex-1 mt-6 pb-10">{children}</div>
    </div>
  );
}