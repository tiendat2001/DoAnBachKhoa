import React, { useContext } from 'react'
import "./navbar.css"
import { Link } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const {user} = useContext(AuthContext)
    return (
        <div className="navbar">
          <div className="navContainer">
        
              <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
               <img className="logo" src="https://www.hilton.com/modules/assets/svgs/logos/WW.svg" alt="" />
            </Link>

            {user ? (<div className="logout">
            <h1 className="account">Hello,{user.username}</h1> 
            <Link to="/login">

              <button className="navButton" >Log out</button>
              </Link>
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
