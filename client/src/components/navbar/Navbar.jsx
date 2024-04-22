import React, { useContext } from 'react'
import "./navbar.css"
import { Link } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const {user , dispatch} = useContext(AuthContext)

  const navigate = useNavigate()
  const handleLogout = ()=>{
    navigate("/login");
    dispatch({ type: "LOGOUT"});
    
  }
    return (
        <div className="navbar">
          <div className="navContainer">
              {/* LOGO */}
              <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
                <h1 className="logo_name">HotelBooking</h1>
               {/* <img className="logo" src="https://www.hilton.com/modules/assets/svgs/logos/WW.svg" alt="" /> */}
            </Link>

           
            {user.username ? (
            <div className="logout">
             <Link to="/admin/hotels">
              <button className="navButton" >Manage your homestay</button>
              </Link>

              <Link to="/bookings">
              <button className="navButton" >Your bookings</button>
              </Link>
              
            <h1 className="account">Hello,{user.username}</h1> 
            {/* <Link to="/login"> */}

              <button className="navButton" onClick={handleLogout} >Log out</button>
              {/* </Link> */}
            </div>
            
            ) : (
            <div className="navItems">
              {/* <button className="navButton" >List your Hotel</button> */}
              <button className="navButton" >Register</button>
              <Link to="/login">

              <button className="navButton" >Login</button>
              </Link>

            </div>
            )}
          </div>
        </div>
      )
}

export default Navbar
