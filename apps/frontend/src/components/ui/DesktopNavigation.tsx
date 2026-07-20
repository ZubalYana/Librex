import CombinedLogo from "./CombinedLogo"
import { UserCircle2 } from "lucide-react"

export default function DesktopNavigation(){
    return(
        <div className="w-full flex justify-between items-center">
            <CombinedLogo/>
            <div className="flex gap-x-2 text-navy">
                <a href="/app/books">All Books</a> | <a href="/app/me/books">My books</a>
            </div>
            <a href="/app/me">
            <UserCircle2/>
            </a>
        </div>
    )
}