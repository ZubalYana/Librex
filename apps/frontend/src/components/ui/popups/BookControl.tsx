import { apiFetch } from "../../../api/apiFetch";
import { useState, useEffect } from "react";
import type { Book } from "../../../types/Book";
import { X } from "lucide-react";
import { Input } from "../Input";
import { Textarea } from "../TextArea";
import { Button } from "../Button";
import BookCoverUploader from "../BookCoverUploader";
import { useAlertStore } from "../../../store/alertStore";

interface BookControl {
  mode: "CREATE" | "EDIT";
  book?: Book;
  onClose: () => void;
  onCreated?: (newBook: Book) => void;
  onEdited?: (newBook: Book) => void;
}

export default function BookControl({
  mode,
  book,
  onClose,
  onCreated,
  onEdited,
}: BookControl) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState<File | null>(null);
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const setAlert = useAlertStore((state) => state.setAlert);

  const onCreateBook = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    if (description) formData.append("description", description);
    formData.append("author", author);

    if (photoUrl) formData.append("photo", photoUrl);

    apiFetch("/userBooks", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        onClose();
        setName("");
        setDescription("");
        setPhotoUrl(null);
        setAuthor("");
        onCreated(data);
        setAlert("success", "Created successfully");
      })
      .catch((err) => setAlert("error", err.message))
      .finally(() => setLoading(false));
  };

  const renderBookInfo = () => {
    if (mode === "EDIT") {
      setName(book.name);
      setDescription(book.description);
      // setPhotoUrl(book.photoUrl);
      setAuthor(book.author);
    }
  };

  useEffect(() => {
    renderBookInfo();
  }, []);

  const onEditBook = () => {
    if (!book) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    if (description) formData.append("description", description);
    formData.append("author", author);

    if (photoUrl) {
      formData.append("photo", photoUrl);
    }

    apiFetch(`/userBooks/${book.id}`, {
      method: "PATCH",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to edit book");
        return res.json();
      })
      .then((data) => {
        onClose();
        if (onEdited) onEdited(data);
        setAlert("success", "Changes saved successfully");
      })
      .catch((err) => setAlert("error", err.message))
      .finally(() => setLoading(false));
  };
  return (
    <div
      className="w-full h-screen fixed z-50 top-0 left-0 bg-navy/40 backdrop-blur-sm flex justify-center items-center p-[20px] md:p-[40px]"
      onClick={(e) => {
        onClose();
        e.stopPropagation();
      }}
    >
      <div
        className="w-full md:w-[600px] min-h-0 bg-parchment rounded-md p-[20px] md:p-[30px] relative"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <X
          onClick={() => onClose()}
          className="absolute cursor-pointer top-[20px] right-[20px] md:top-[30px] md:right-[30px]"
        />
        {mode === "CREATE" ? (
          <div className="w-full h-full flex flex-col">
            <h2 className="text-[20px] font-semibold">Create a book</h2>
            <div className="w-full flex justify-between mt-4">
              <div className="w-[40%]">
                <BookCoverUploader
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e)}
                />
              </div>
              <div className="w-[55%] flex flex-col gap-y-4">
                <Input
                  placeholder="Title"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Textarea
                  rows={7}
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <Input
                  placeholder="Author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full flex justify-center mt-6">
              <div className="w-full md:w-[300px]">
                <Button
                  variant="primary"
                  isLoading={loading}
                  size="lg"
                  className="w-full"
                  onClick={() => onCreateBook()}
                >
                  Create
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col">
            <h2 className="text-[20px] font-semibold">Edit a book</h2>
            <div className="w-full flex justify-between mt-4">
              <div className="w-[40%]">
                <BookCoverUploader
                  value={photoUrl}
                  url={book.photoUrl}
                  onChange={(e) => setPhotoUrl(e)}
                />
              </div>
              <div className="w-[55%] flex flex-col gap-y-4">
                <Input
                  placeholder="Title"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Textarea
                  rows={7}
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <Input
                  placeholder="Author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full flex justify-center gap-x-4 mt-6">
              <Button variant="secondary" size="lg" onClick={() => onClose()}>
                Cancel
              </Button>
              <Button
                variant="primary"
                isLoading={loading}
                size="lg"
                className="w-[250px]"
                onClick={() => onEditBook()}
              >
                Confirm changes
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
