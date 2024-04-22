import React from 'react'
import './hotelStatistics.css'
import Sidebar from '../../../components/adminComponents/sidebar/Sidebar'
import NavbarAdmin from '../../../components/adminComponents/navbarAdmin/NavbarAdmin'
import { Link, useLocation } from "react-router-dom";

import axios from 'axios';
import useFetch from '../../../hooks/useFetch';
const HotelStatistics = () => {
    const location = useLocation();
    const hotelId = location.pathname.split("/")[4]; 
    const { data, loading, error, reFetch } = useFetch(
        `/reservation/getRevenue/${hotelId}`);
    // console.log(data)


    return (
        //   css từ adminHome.css
        <div className="listAdmin">
            <Sidebar />
            <div className="listContainerAdmin">
                <NavbarAdmin />

                <div className="hotelStatisticContainer">
                    <div style={{fontSize:'30px',fontWeight:'bold'}}>Tổng quan</div>

                    <div className="overviewStatistic"> 
                        <div></div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default HotelStatistics
