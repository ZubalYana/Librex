import { apiFetch } from "../../../api/apiFetch";
import { useState, useEffect } from 'react';
import type { Book } from "../../../types/Book";
import { X } from "lucide-react";
import { Input } from "../Input";
import {Textarea} from "../TextArea"
import { Button } from "../Button";
import BookCoverUploader from "../BookCoverUploader";
import { useAlertStore } from "../../../store/alertStore";

interface BookControl{
    mode: 'CREATE' | 'EDIT';
    book?: Book;
    onClose: ()=>void;
    onCreated?: (newBook: Book) => void;
    onEdited?: (newBook: Book) => void;
}

export default function BookControl({mode, book, onClose, onCreated}: BookControl){
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [photoUrl, setPhotoUrl] = useState<File | null>(null);
    const [author, setAuthor] = useState('');
    const [loading, setLoading] = useState(false);
    const setAlert = useAlertStore((state)=>(state.setAlert))

    const onCreateBook = ()=>{
        setLoading(true);
        const formData = new FormData();
        formData.append("name", name);
        if(description) formData.append("description", description);
        formData.append("author", author);

        if(photoUrl) formData.append("photo", photoUrl)

        apiFetch('/userBooks', {
            method: 'POST',
            body: formData
        })
        .then((res)=>res.json())
        .then((data)=>{
            console.log(data);
            onClose();
            setName("");
            setDescription("");
            setPhotoUrl(null);
            setAuthor("")
            onCreated(data)
            setAlert("success", "Created successfully")
        })
        .catch((err)=>setAlert("error", err.message))
        .finally(()=>setLoading(false));
    }

    const renderBookInfo = ()=>{
        if(mode==="EDIT"){
            setName(book.name);
        setDescription(book.description);
        // setPhotoUrl(book.photoUrl);
        setAuthor(book.author);
        }
    }

    useEffect(()=>{
        renderBookInfo()
    }, [])
    return(
        <div 
        className='w-full h-screen fixed top-0 left-0 bg-navy/40 backdrop-blur-sm flex justify-center items-center p-[20px] md:p-[40px]'
        onClick={(e)=>{
            onClose()
            e.stopPropagation()
        }}
        >
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
                <Button variant="primary" isLoading={loading} size="lg" className="w-full" onClick={()=>onCreateBook()}>Create</Button>
                </div>
                </div>
            </div> :
            <div>EDIT A BOOK: {book.id}</div>}
        </div>
        </div>
    )
}