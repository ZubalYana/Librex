import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./components/landing/Landing";
import Register from "./components/pages/Register";
import Login from "./components/pages/Login";

import ProtectedRoute from "./components/functional/ProtectedRoute";
import AdminDashboard from "./components/pages/AdminDashboard";
import BookDetails from "./components/pages/BookDetails";
import BooksList from "./components/pages/BooksList";
import MyBooks from "./components/pages/MyBooks";
import Profile from "./components/pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/app" element={<ProtectedRoute />}>
          <Route path="/books" element={<BooksList />} />
          <Route path="/books/:bookId" element={<BookDetails />} />
          <Route path="/me" element={<Profile />} />
          <Route path="/me/books" element={<MyBooks />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
