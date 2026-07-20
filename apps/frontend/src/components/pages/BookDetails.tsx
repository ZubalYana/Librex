import { useState, useEffect } from 'react';
import type { Book } from '../../types/Book';
import { apiFetch } from '../../api/apiFetch';
import { useParams } from 'react-router-dom';
import { useAlertStore } from '../../store/alertStore';
import { ArrowLeft, User } from 'lucide-react';

export default function BookDetails(){
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(false);
    const setAlert = useAlertStore((state)=>(state.setAlert));
    const {bookId} = useParams();

    useEffect(()=>{
        setLoading(true);
        apiFetch(`/books/${bookId}`, {
            method: 'GET'
        })
        .then((res)=>res.json())
        .then((data)=>{
            console.log(data);
            setBook(data);
        })
        .catch((err)=>{setAlert("error", err.message)})
        .finally(()=>setLoading(false));
    }, []);

    if(loading){
        return <div>Loading book details...</div>
    }

    if(!book){
        return <div>Could not find the book</div>
    }

    return(
        <div className='w-full min-h-screen p-[20px] lg:px-[40px]'>
            <a href="/app/books" className='w-full'><ArrowLeft/></a>
            <div className='w-full flex flex-col md:flex-row md:justify-between'>
                <div className='w-full md:w-[40%] mt-6'>
                    <img src={book.photoUrl} alt={book.name} className='' />
                </div>
                <div className='w-full md:w-[45%]'>
                    <h1>{book.name}</h1>
                    <p>{book.description}</p>
                    <p className='flex gap-x-2'><User/>{book.author}</p>
                    <div>
                        <p>Owner:</p>
                        <div className='flex gap-x-2'>
                            <img src={book.owner.avatar} alt="Owner awatar" />
                            <p>{book.owner.name}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}