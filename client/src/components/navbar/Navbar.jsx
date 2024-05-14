import React, { useContext,useState } from 'react'
import "./navbar.css"
import { Link } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext)
  const [showInfoUser, setShowInfoUser] = useState(false);
  const navigate = useNavigate()
  const handleLogout = async () => {

    const res = await axios.post("/auth/logout");
    navigate("/login");
    dispatch({ type: "LOGOUT" });

  }

  const toggleOptions = () => {
    setShowInfoUser(!showInfoUser);
  };
  return (
    <div className="navbar">
      <div className="navContainer">
        {/* LOGO */}
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <h1 className="logo_name">HotelBooking</h1>
          {/* <img className="logo" src="https://www.hilton.com/modules/assets/svgs/logos/WW.svg" alt="" /> */}
        </Link>


        {user?.username ? (
          <div className="logout">
            <Link to="/admin/hotels">
              <button className="navButton" >Quản lý chỗ nghỉ của bạn</button>
            </Link>

            <Link to="/bookings">
              <button className="navButton" >Đơn đặt phòng của bạn</button>
            </Link>

            <div className="account" >
            <h1 onClick={toggleOptions}>Xin chào, {user?.username}</h1>
            {showInfoUser && (
              <div className="account_options" >
                <Link to="/update-info">Cập nhật thông tin</Link>
                <Link to="/admin/changePassword">Đổi mật khẩu</Link>
              </div>
            )}
            </div>
            {/* <Link to="/login"> */}

            <button className="navButton" onClick={handleLogout} >Đăng xuất</button>
            {/* </Link> */}
          </div>

        ) : (
          <div className="navItems">
            {/* <button className="navButton" >List your Hotel</button> */}
            <button className="navButton" >Đăng ký</button>
            <Link to="/login">

              <button className="navButton" >Đăng nhập</button>
            </Link>

          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
