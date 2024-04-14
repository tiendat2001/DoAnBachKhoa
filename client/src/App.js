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
import ModifyHotel from "./pages/adminPages/ModifyHotel/ModifyHotel";
import ListRoom from "./pages/adminPages/ListRoom/ListRoom";
import ListBooking from "./pages/listBooking/ListBooking";
import Reserve from "./pages/reserve/Reserve";
import NewRoom from "./pages/adminPages/newRoom/NewRoom";
import ModifyRoom from "./pages/adminPages/ModifyRoom/ModifyRoom";
import { getCookie } from 'react-use-cookie';
function App() {


  const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    const userToken = getCookie('access_token');
    // console.log(userToken)
    // chua dang nhap thi tu dong nhay sang trang login
    if (!user || !userToken) {
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
        <Route path="/bookings" element={<ListBooking />} />
        <Route path="/reserve" element={<Reserve />} />




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

          <Route path="hotels/:id" element={
            <ProtectedRoute>
              <ModifyHotel />
            </ProtectedRoute>
          } />

          <Route path="rooms" element={
            <ProtectedRoute>
              <ListRoom />
            </ProtectedRoute>
          } />

          <Route path="rooms/new" element={
            <ProtectedRoute>
              <NewRoom />
            </ProtectedRoute>
          } />

          <Route path="rooms/:id" element={
            <ProtectedRoute>
              <ModifyRoom />
            </ProtectedRoute>
          } />



        </Route>


      </Routes>
      <ToastContainer />
    </BrowserRouter>

  );
}

export default App;
