// import { apiFetch } from "../../../api/apiFetch";
import type { Book } from "../../../types/Book";
import { X } from "lucide-react";

interface BookControl{
    mode: 'CREATE' | 'EDIT';
    book?: Book;
    onClose: ()=>void;
}

export default function BookControl({mode, book, onClose}: BookControl){
    return(
        <div 
        className="w-full md:w-[600px] min-h-0 bg-parchment rounded-md p-[20px] md:p-[30px]"
        onClick={(e)=>{e.stopPropagation()}}
        >
            <X onClick={()=>onClose} className="absolute top-[20px] right-[20px] md:top-[20px] md:right-[40px]"/>
            {mode === 'CREATE'?
            <div>CREATE A BOOK</div> :
            <div>EDIT A BOOK: {book.id}</div>}
        </div>
    )
}