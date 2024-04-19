import React from 'react'
import './administrator.css'
import SidebarAdministrator from '../../components/adminComponents/sidebarAdministrator/SidebarAdministrator'
import NavbarAdmin from '../../components/adminComponents/navbarAdmin/NavbarAdmin'
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
