import DesktopNavigation from "../ui/DesktopNavigation";

export default function HeaderContainer({children}){
    return(
        <div className="p-[20px] lg:px-[40px]">
            <DesktopNavigation/>
            {children}
        </div>
    )
}