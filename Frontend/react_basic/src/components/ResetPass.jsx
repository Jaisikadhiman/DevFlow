import axios from "axios";
import React, { useState} from "react";
import { useNavigate, useParams } from "react-router-dom";

const ResetPass = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const navigate=useNavigate();
  const handleClick = async () => {
    try {
      console.log(password);
      const resp = await axios.post(
        `http://localhost:8083/api/employee/resetPass/${token}`,
        password
      );
      if(resp.data.success){
        alert("update successfully");
        navigate("/login")
      }
      console.log(resp);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <br />
      <input
        type="password"
        placeholder="Enter Password"
        onChange={(e) => setPassword({ password: e.target.value })}
      />
      <br /> <br />
      <input
        type="password"
        placeholder="Confirm Password"
        onChange={(e) => setCpassword({ password: e.target.value })}
      />
      <br /> <br />
      <button onClick={handleClick}>Reset</button>
    </>
  );
};

export default ResetPass;
