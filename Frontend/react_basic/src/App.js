import React from "react";
import Navvv from "./Nav/Navvv";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Login from "../src/components/Login";
import Register from "../src/components/Register";
import View from "../src/components/View";
import List from "../src/components/List";
import Edit from "../src/components/Edit";
import Forgot from "./components/Forgot";
import ResetPass from "./components/ResetPass";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./components/Profile";
import ProtectedRoutes from "./components/ProtectedRoutes";
import VerifyOtp from "./components/VerifyOtp";
import Home from "./components/Home";

const App = () => {
  const location = useLocation();
  const hiddenNavRoutes = ["/login"];
  const isLoggedIn = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  return (
    <>
      {/* <Navvv/> */}
      {!hiddenNavRoutes.includes(location.pathname) && <Navvv />}
      <Routes>
        {!isLoggedIn && (
          <>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/" element={<Home />}></Route>
          </>
        )}
        <Route element={<ProtectedRoutes />}>
          <Route path="/register" element={<Navigate to={"/"} />}></Route>
          <Route path="/login" element={<Navigate to={"/"} />}></Route>
          {role === "admin" ? (
            <>
              <Route path="/" element={<Navigate to={"/list"} />}></Route>
              <Route path="/profile" element={<Profile />}></Route>
              <Route path="/list" element={<List />}></Route>
            </>
          ) : (
            <>
              <Route path="/" element={<Navigate to={"/"} />}></Route>

              <Route path="/profile" element={<Profile />}></Route>
              <Route path="/list" element={<Navigate to={"/"} />}></Route>
            </>
          )}
        </Route>

        <Route path="/view/:id" element={<View />}></Route>
        <Route path="/edit/:id" element={<Edit />}></Route>
        <Route path="/forgot" element={<Forgot />}></Route>
        <Route path="/resetPass/:token" element={<ResetPass />}></Route>
        <Route path="/verifyOtp/:id" element={<VerifyOtp />}></Route>
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;
