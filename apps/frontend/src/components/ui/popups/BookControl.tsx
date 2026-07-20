import { apiFetch } from "../../../api/apiFetch";
import { useState, useEffect } from 'react';
import type { Book } from "../../../types/Book";
import { X } from "lucide-react";
import { Input } from "../Input";
import {Textarea} from "../TextArea"
import { Button } from "../Button";
import BookCoverUploader from "../BookCoverUploader";

interface BookControl{
    mode: 'CREATE' | 'EDIT';
    book?: Book;
    onClose: ()=>void;
}

export default function BookControl({mode, book, onClose}: BookControl){
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [photoUrl, setPhotoUrl] = useState<File | null>(null);
    const [author, setAuthor] = useState('');
    return(
        <div 
        className="w-full md:w-[600px] min-h-0 bg-parchment rounded-md p-[20px] md:p-[30px] relative"
        onClick={(e)=>{e.stopPropagation()}}
        >
            <X onClick={()=>onClose()} className="absolute cursor-pointer top-[20px] right-[20px] md:top-[30px] md:right-[30px]"/>
            {mode === 'CREATE'?
            <div className="w-full h-full flex flex-col">
                <h2 className="text-[20px] font-semibold">Create a book</h2>
                <div className="w-full flex justify-between mt-4">
                    <div className="w-[40%]">
                        <BookCoverUploader value={photoUrl} onChange={(e)=>setPhotoUrl(e)}/>
                    </div>
                    <div className="w-[55%] flex flex-col gap-y-4">
                        <Input placeholder="Title" value={name} onChange={(e)=>setName(e.target.value)}/>
                        <Textarea rows={7} placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)}/>
                        <Input placeholder="Author" value={author} onChange={(e)=>setAuthor(e.target.value)}/>
                    </div>
                </div>
                <div className="w-full flex justify-center mt-6">
                    <div className="w-full md:w-[300px]">
                <Button variant="primary" size="lg" className="w-full">Create</Button>
                </div>
                </div>
            </div> :
            <div>EDIT A BOOK: {book.id}</div>}
        </div>
    )
}