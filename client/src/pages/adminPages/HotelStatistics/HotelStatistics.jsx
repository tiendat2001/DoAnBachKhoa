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
                    <div style={{fontSize:'30px',fontWeight:'bold',marginBottom:'10px'}}>Tổng quan</div>

                    <div className="overviewStatistic"> 
                        <div className="overviewStatistic_card">
                            <div style={{fontSize:'15px'}}>Tổng doanh thu (VND)</div>
                            <div style={{fontWeight:'bold',fontSize:'30px'}}>
                                {new Intl.NumberFormat('vi-VN').format(data.totalRevenue*1000)}</div>
                        </div>

                        <div className="overviewStatistic_card">
                            <div  style={{fontSize:'15px'}}>Tổng số khách</div>
                            <div style={{fontWeight:'bold',fontSize:'30px'}}>{data.totalGuests}</div>
                        </div>

                        <div className="overviewStatistic_card">
                            <div style={{fontSize:'15px'}}>Tổng số đơn đặt</div>
                            <div style={{fontWeight:'bold',fontSize:'30px'}}>{data.totalOrders}</div>
                        </div>
                    </div>

                    <div>Loại phòng bán chạy nhất: {data.maxSoldRoomType} ({data.maxSoldRoomCount} đã bán)</div>
                </div>
            </div>
        </div>

    )
}

export default HotelStatistics
