import { useState, useEffect } from 'react';
import { apiFetch } from "../../api/apiFetch";
import { useAlertStore } from '../../store/alertStore';
import BookCard from '../ui/BookCard';

export default function BooksList(){
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);

    const setAlert = useAlertStore((state)=>(state.setAlert));

    useEffect(()=>{
        setLoading(true);
        apiFetch('/books/books', {
            method: 'GET'
        })
        .then((res)=>res.json())
        .then((data)=>{
            setBooks(data.books);
            console.log(data)
        })
        .catch(err=>setAlert("error", err.message))
        .finally(()=>setLoading(false));
    }, [])

    if(loading){
        return <div>Loading books...</div>
    }

    if(books.length === 0){
        return <div>No books found</div>
    }

    return(
        <div className="w-full">
            <h1>Community books:</h1>
            <div className='w-full'>
            {books.map((book)=>(
                <BookCard book={book} key={book.id}/>
            ))}
            </div>
        </div>
    )
}