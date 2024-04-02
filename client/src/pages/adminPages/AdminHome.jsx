import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
const AdminHome = () => {

const {user , dispatch} = useContext(AuthContext)
  return (
    <div>
      <h1>{user._id}</h1>
    </div>
  )
}

export default AdminHome
