import React from 'react'
import './administrator.css'
import SidebarAdministrator from '../../components/adminComponents/sidebarAdministrator/SidebarAdministrator'
import NavbarAdmin from '../../components/adminComponents/navbarAdmin/NavbarAdmin'
import { DataGrid } from "@mui/x-data-grid";
import { roomColumns } from '../../datatablesource';
import useFetch from '../../hooks/useFetch';
import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext';
import { Link, useLocation } from "react-router-dom";
const Administrator = () => {
  return (
    // css tu AdminHome
    <div className="listAdmin">
      <SidebarAdministrator />
      <div className="listContainerAdmin">
        <NavbarAdmin />
        {/* <h1>bang</h1> */}
      </div>
    </div>
  )
}

export default Administrator
