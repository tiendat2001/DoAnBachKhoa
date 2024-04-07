import React from 'react'
import Sidebar from '../../../components/adminComponents/sidebar/Sidebar'
import NavbarAdmin from '../../../components/adminComponents/navbarAdmin/NavbarAdmin'
import "./listRoom.css"
import { DataGrid } from "@mui/x-data-grid";
import { roomColumns } from '../../../datatablesource';
const ListRoom = () => {
    return (
        <div className="listAdmin">
            <Sidebar />
            <div className="listContainerAdmin">
                <NavbarAdmin />
           </div>
        </div>

    )
}

export default ListRoom
