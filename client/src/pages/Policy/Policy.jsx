import React from 'react'
import "./policy.css"
import Navbar from '../../components/navbar/Navbar'
import Header from '../../components/header/Header'
const Policy = () => {
    return (
        <div>
            <Navbar />
            <Header type="list" />
            <div className="policyContainer">
                <h1>Chính sách hủy</h1>
            </div>
        </div>
    )
}

export default Policy
