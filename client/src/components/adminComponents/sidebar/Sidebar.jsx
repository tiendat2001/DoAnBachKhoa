import "./sidebar.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIcon from "@mui/icons-material/Store";
// import InsertChartIcon from "@mui/icons-material/InsertChart";
// import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
// import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
// import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
// import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link } from "react-router-dom";
// import { DarkModeContext } from "../../context/darkModeContext";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
const Sidebar = () => {
  // const { dispatch } = useContext(DarkModeContext);
  const { user, dispatch } = useContext(AuthContext)
  const [selectedItem, setSelectedItem] = useState("");
  const navigate = useNavigate();

 

  const handleChangeSelectedItem = (item,) => {
    setSelectedItem(item);
  };


  const handleLogOut = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "LOGOUT" });
      const res = await axios.post("/auth/logout");
      navigate("/login");
    } catch (err) { }
  };
  return (
    <div className="sidebar">
      <div className="top">
        {/* /admin/hotels */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">HotelBooking</span>
        </Link>
      </div>
      {/* <hr /> */}
      <div className="center">
        <ul>
          {/* <p className="title">MAIN</p>
          <Link to="/" style={{ textDecoration: "none" }}>
            <li>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </li>
          </Link> */}
          <p className="title">MỤC</p>
          {/* <Link to="/users" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Users</span>
            </li>
          </Link> */}
          <Link to="/admin/hotels" style={{ textDecoration: "none" }} onClick={() => handleChangeSelectedItem("hotels")}>
            <li style={{ backgroundColor: selectedItem == 'hotels' ? '#ece8ff' : '' }}>
              <StoreIcon className="icon" />
              <span>Chỗ nghỉ</span>
            </li>
          </Link>
          <Link to="/admin/rooms" style={{ textDecoration: "none" }} onClick={() => handleChangeSelectedItem("rooms")}>
            <li style={{ backgroundColor: selectedItem == 'rooms' ? '#ece8ff' : '' }}>
              <CreditCardIcon className="icon" />
              <span>Phòng</span>
            </li>
          </Link>
          <Link to="/admin/reservations" style={{ textDecoration: "none" }} onClick={() => handleChangeSelectedItem("reservations")}>
            <li style={{ backgroundColor: selectedItem == 'reservations' ? '#ece8ff' : '' }}>
              <LocalShippingIcon className="icon" />
              <span>Đơn đặt phòng</span>
            </li>
          </Link>
          {/* <p className="title">USEFUL</p>
          <li>
            <InsertChartIcon className="icon" />
            <span>Stats</span>
          </li>
          <li>
            <NotificationsNoneIcon className="icon" />
            <span>Notifications</span>
          </li>
          <p className="title">SERVICE</p>
          <li>
            <SettingsSystemDaydreamOutlinedIcon className="icon" />
            <span>System Health</span>
          </li>
          <li>
            <PsychologyOutlinedIcon className="icon" />
            <span>Logs</span>
          </li>
          <li>
            <SettingsApplicationsIcon className="icon" />
            <span>Settings</span>
          </li> */}
          <p className="title">TÀI KHOẢN</p>

          <Link to="/admin/changePassword" style={{ textDecoration: "none" }}>
            <li>
              <AccountCircleOutlinedIcon className="icon" />
              <span>Đổi mật khẩu</span>
            </li>
          </Link>

          <li onClick={handleLogOut}>
            <ExitToAppIcon className="icon" />
            <span>Logout</span>
          </li>
        </ul>
      </div>
      {/* <div className="bottom">
        <div
          className="colorOption"
          // onClick={() => dispatch({ type: "LIGHT" })}
        ></div>
        <div
          className="colorOption"
          // onClick={() => dispatch({ type: "DARK" })}
        ></div>
      </div> */}
    </div>
  );
};

export default Sidebar;
