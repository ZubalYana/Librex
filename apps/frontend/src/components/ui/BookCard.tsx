type Owner = {
  name: string;
  avatar: string;
  email: string;
};

type Book = {
  id: string;
  name: string;
  description: string;
  photoUrl: string;
  author: string;
  owner: Owner;
};

interface BookCardProps{
    book: Book | null;
}

export default function BookCard({book}: BookCardProps){
    return(
        <div className="w-[170x] h-[220px] md:w-[220px] md:h-[300px] relative">
            <div className="w-full h-full">
                <img 
                src={book.photoUrl} 
                alt={book.name} 
                className="w-full h-full background-center absolute top-0 left-0 z-10" 
                />
                <div className="w-full h-full bg-navy/20 z-20"></div>
            </div>
            <div className="w-full h-[100px] absolute left-0 bottom-0 z-50">
                <h3>{book.name}</h3>
                <p>{book.description}</p>
                <p>{book.author}</p>
            </div>
        </div>
    )
}