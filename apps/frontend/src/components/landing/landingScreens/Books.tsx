import { useState, useEffect } from 'react';
import { apiFetch } from '../../../api/apiFetch';
import { useAlertStore } from '../../../store/alertStore';
import { Button } from '../../ui/Button';
import { Search } from 'lucide-react';

export default function Books(){
    const [books, setBooks] = useState([]);
    const setAlert = useAlertStore((state)=>(state.setAlert));

    useEffect(()=>{
        apiFetch('/books/books', {
            method: 'GET'
        })
        .then((res)=>res.json())
        .then((data)=>{
            setBooks(data.books.slice(0, 5));
        })
        .catch((err)=>{
            console.error(err)
            setAlert("error", err.message);
        })
    }, [])

    if(books.length === 0){
        return <div>Loading...</div>
    }

    return(
        <div>
            <h3>Books awaiting to be traded:</h3>
            {books.map((book)=>(
                <div key={book.id}>{book.id}</div>
            ))}

            <Button variant='primary' size='lg'><Search/> Explore more books</Button>
        </div>
    )
}