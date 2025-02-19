import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
const Navvv = () => {
  const token = localStorage.getItem("token");
  const imgg= localStorage.getItem("profileImg");
// console.log(imgg)
  const path="data:image/jpeg;base64,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";
const [imgSrc,setImgSrc]=useState(path);
  const mainDiv = {
    display: "flex",
    justifyContent: "space-between", // Keep space between left and right sections
    alignItems: "center",
    padding: "10px",
  };
  const leftDiv = {
    display: "flex",
    alignItems: "center",
  };

  const rightDiv = {
    display: "flex",
    alignItems: "center", // Align the items in the center (vertically)
  };

  const profileImageStyle = {
    width: "40px", // Set the width of the profile image
    height: "40px", // Set the height of the profile image
    borderRadius: "50%", // Make the profile image circular
    marginLeft: "10px", // Add some space between Profile link and the image
  };

  const logoutbtn = {
    marginLeft: "15px", // Add space between the profile image and the logout button
    padding: "5px 10px",
    borderRadius: "5px",
    backgroundColor: "#blue", // Background color
    border: "1px solid #ced4da", // Border color
    cursor: "pointer",
  };
  const handlebtn=()=>{
localStorage.removeItem("token");
localStorage.removeItem("role");
localStorage.removeItem("profileImg");

window.location.href="/login";
  }
 
//   useEffect(() => {
// //  console.log(imgg)
//    setImgSrc(`http://localhost:8083/profileImages/${imgg}`)
//   }, [imgSrc]);
useEffect(() => {
  if (imgg !== "undefined") {
    setImgSrc(`http://localhost:8083/profileImages/${imgg}`);
  }
  if(imgg === null){
    setImgSrc(path);

  }

}, [imgg]);
console.log(imgSrc);
  return (
    <>
      <Navbar className="navbar" expand="lg" bg="secondary" data-bs-theme="dark" >
        <Container>
          <Nav className="me-auto">
            {token ? (
              <>
                <div style={mainDiv}>
                  <div style={leftDiv}>
                    <Nav.Link href="/list">List</Nav.Link>{" "}
                  </div>
                  <div style={rightDiv}>
                    <Nav.Link href="/profile">Profile</Nav.Link>{" "}
                    <img
                      style={profileImageStyle}
                      src={imgSrc}
                    ></img>
                    <button onClick={handlebtn} style={logoutbtn}>Logout</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Nav.Link href="/register">Register</Nav.Link>
                <Nav.Link href="/login">Login</Nav.Link>
              </>
            )}
            {/* <Nav.Link href="/register">Register</Nav.Link>
            <Nav.Link href="/login">Login</Nav.Link>
            <Nav.Link href="/login">Profile</Nav.Link>

            <Nav.Link href="/list">List</Nav.Link> */}
          </Nav>
        </Container>
      </Navbar >
     
{/* <div>
  <img className="img" src="https://www.zauca.com/wp-content/uploads/one-page-single-website-design-1024x576.png"/>
</div> */}
    </>
  );
};

export default Navvv;
