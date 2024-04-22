import React from 'react'
import './hotelStatistics.css'
import Sidebar from '../../../components/adminComponents/sidebar/Sidebar'
import NavbarAdmin from '../../../components/adminComponents/navbarAdmin/NavbarAdmin'
const HotelStatistics = () => {
    return (
        //   css từ adminHome.css
        <div className="listAdmin">
            <Sidebar />
            <div className="listContainerAdmin">
                <NavbarAdmin />
            </div>
        </div>

    )
}

export default HotelStatistics
