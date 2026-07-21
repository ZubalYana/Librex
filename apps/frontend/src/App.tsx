import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./components/landing/Landing";
import Register from "./components/pages/Register";
import Login from "./components/pages/Login";

import ProtectedRoute from "./components/functional/ProtectedRoute";
import AdminProtectedRoute from "./components/functional/AdminProtectedRoute";
import HeaderContainer from "./components/functional/HeaderContainer";

import AdminDashboard from "./components/pages/AdminDashboard";
import BookDetails from "./components/pages/BookDetails";
import BooksList from "./components/pages/BooksList";
import MyBooks from "./components/pages/MyBooks";
import Profile from "./components/pages/Profile";

import ChangeEmailConfirm from "./components/pages/ChangeEmailConfirm";

import { AlertBanner } from "./components/ui/AlertBanner";

function App() {
  return (
    <BrowserRouter>
    <AlertBanner/>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/change-email" element={<ChangeEmailConfirm/>}/>

        <Route path="/app" element={<ProtectedRoute />}>
          <Route path="/app/books" element={<HeaderContainer><BooksList /></HeaderContainer>} />
          <Route path="/app/books/:bookId" element={<BookDetails />} />
          <Route path="/app/me" element={<HeaderContainer><Profile /></HeaderContainer>} />
          <Route path="/app/me/books" element={<HeaderContainer><MyBooks /></HeaderContainer>} />

          <Route element={<AdminProtectedRoute/>}>
          <Route path="/app/admin" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
