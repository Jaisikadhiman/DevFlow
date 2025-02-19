import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "./context";
import { useNavigate } from "react-router-dom";
// import jwt from "jsonwebtoken";

const Forgot = (props) => {
  const { storeEmail,storeProfile, storeToken ,storeOtpExpiration,storeOtpHash } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const resp = await axios.post(
      "http://localhost:8083/api/employee/forgot",
      email
    );

    console.log(resp.data.data.otpExpiration);
    if (!resp.data.success) {
      alert(resp.data);
    } else {
      alert("check email link for reset password");
      const id=resp.data.data._id
      // console.log(resp.data.data._id)
      storeToken(resp.data.token);
      storeOtpHash(resp.data.data.otpHash);
      storeOtpExpiration(resp.data.data.otpExpiration);
      // storeProfile(props.path);

      navigate(`/verifyOtp/${id}`);
    }
    // if(resp.status===400){
    //     alert(resp.data.message)
    // }
    // console.log(data);
  };
  return (
    <div>
      <br />
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter email"
          onChange={(e) => setEmail({ email: e.target.value })}
        />{" "}
        <br /> <br />
        <button type="submit">Click</button>
      </form>
    </div>
  );
};

export default Forgot;
