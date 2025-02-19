import React from 'react'
import {Route,Outlet, redirect,Navigate} from "react-router-dom"
const ProtectedRoutes = () => {
    const isLoggedIn = localStorage.getItem("token");
  return isLoggedIn?<Outlet/>:<Navigate to={"login"} />
}

export default ProtectedRoutes
