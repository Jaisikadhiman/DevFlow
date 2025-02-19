import axios from 'axios';
import React, { useEffect, useState ,useContext } from 'react'
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context';


const VerifyOtp = () => {


  const token= localStorage.getItem("token");
  const[otp,setOtp] = useState("");
  const[id,setId]=useState("");
  const navigate=useNavigate();
 useEffect(()=>{
  if(token){
    const decoded = jwtDecode(token);
    const id= decoded.data._id;
    // const img= decoded.profileImg;
    setId(id);

    // console.log(decoded.data.profileImage);

  }
 },[]) 


 const handleSubmit=async(e)=>{
  e.preventDefault();
try {
  const resp = await axios.post(`http://localhost:8083/api/employee/verifyOtp/${id}`,{otp});
  if(resp.data.success){
navigate(`/resetPass/${token}`);
  }else{
    alert(resp.data.message);
  }
} catch (error) {
  
}
 }

  return (
    // <div>hello</div>
   <form onSubmit={handleSubmit} action="">
    <div>
      <input type="text" placeholder='Enter OTP' value={otp} onChange={(e)=>setOtp(e.target.value)}/>
      <button type='submit'>Verify OTP</button>
    </div>
   </form>
  )
}

export default VerifyOtp
