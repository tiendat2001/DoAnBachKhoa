import React, { useContext } from "react";
import "./App.css";
import Home from "./pages/home/Home";
import List from "./pages/list/List";
import Hotel from "./pages/hotel/Hotel";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import AdminHome from "./pages/adminPages/adminHome/AdminHome";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import ListHotel from "./pages/adminPages/ListHotel/ListHotel";
import NewHotel from "./pages/adminPages/newHotel/NewHotel";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
  
function App() {


  const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    // chua dang nhap thi tu dong nhay sang trang login
    if (!user) {
      return <Navigate to="/login" />;
    }

    return children;
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<List />} />
        <Route path="/hotels/:id" element={<Hotel />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        <Route path="/admin/">
          <Route index element={
            <ProtectedRoute>
              <AdminHome />
            </ProtectedRoute>
          } />

          <Route path="hotels" element={
            <ProtectedRoute>
              <ListHotel />
            </ProtectedRoute>
          } />

          <Route path="hotels/new" element={
            <ProtectedRoute>
              <NewHotel />
            </ProtectedRoute>
          } />



        </Route>


      </Routes>
      <ToastContainer />
    </BrowserRouter>

  );
}

export default App;
