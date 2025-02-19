import axios from "axios";
import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { faEdit, faTrash, faEye, faL } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import Swal from "sweetalert2";
import { ColorRing } from "react-loader-spinner";

const List = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const naviagte = useNavigate();
  // useEffect(() => {
  //   moment.updateLocale('en', {
  //     relativeTime: {
  //       future: 'in %s',
  //       past: '%s ago',
  //       s: 'a few seconds',
  //       ss: '%d seconds',
  //       m: 'a minute',
  //       mm: '%d minutes',
  //       h: 'an hour',
  //       hh: '%d hours',
  //       d: 'a day',
  //       dd: '%d days',
  //       M: 'a month',
  //       MM: '%d months',
  //       y: 'a year',
  //       yy: '%d years',
  //     },
  //   });
  // }, []);

  useEffect(() => {
    fetchData();
  }, [search, currentPage]);
  let toastId = null;

  const handleError = (message) => {
    // Check if a toast with this ID is already active
    if (!toast.isActive(toastId)) {
      toastId = toast.error(message);
    }
  };
  const fetchData = async (selected) => {
    const token = localStorage.getItem("token");
    // console.log(req.auth.data);
    if (token === "null") {
      naviagte("/");
    }
    //  console.log(token)
    if (token) {
      const decodeToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (currentTime > decodeToken.exp) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        // localStorage.removeItem("token");
        toast.error("token expired");
        naviagte("/login");
      }
    }
    try {
      setLoading(true);
      const resp = await axios.get("http://localhost:8083/api/employee/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit: 3,
          search: search,
          page: currentPage,
        },
      });
      const dataArray = resp.data.data;
      console.log(data);
      console.log(resp);
      // toast.error(resp.data.result);
      // console.log(token.data.email);
      if (resp.status === 200 && typeof resp.data === "object") {
        setLoading(false);
        setPageCount(resp.data.pageCount);
        // const arr=dataArray
        setData(dataArray);
      } else {
        setLoading(false);
        console.log(resp);
        toast.error(resp.data.message);
      }
    } catch (error) {
      if (error.response) {
        // Handle errors from the backend
        // if(error.response.data.message === "Token Expired"){
        //   handleError(error.response.data.message);
        //   localStorage.removeItem("token");
        //   naviagte("/login");
        // }
        handleError(error.response.data.message);
        // console.log("error.response.data.message,",error.response.data.message)
        // toast.error(error.response.data.message);
        // Display error message from auth
      }
    }
  };
  
  
  
  
  const handleDelete = async (id) => {
    await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const resp = await axios.post(
          `http://localhost:8083/api/employee/delete/${id}`
        );
        if (resp.data.success) {
          await Swal.fire({
            title: "Done",
            text: "deleted",
            icon: "success",
            timer: 2000,
            button: false,
          });
          window.location.reload();
        }
      }
    });
    // console.log(id);
    // // const resp = await axios.post(
    // //   `http://localhost:8083/api/employee/delete/${id}`
    // // );
    // console.log(resp);
    // if (resp.data.success) {
    //   window.location.reload();
    //   // alert("data not deleted")
    // }
    // else {
    //   // alert("deleted successfully")
    // }
  };
  const handlepageclick = async (selected) => {
    console.log(selected);
    setCurrentPage(selected.selected + 1);
    console.log(currentPage);
  };
  return (
    <>
      {/* <ColorRing
  visible={loading}
  height="80"
  width="80"
  ariaLabel="color-ring-loading"
  wrapperStyle={{}}
  wrapperClass="color-ring-wrapper"
  colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
  /> */}
      {loading && (
        <div>
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            style={{
              fontSize: "2rem",
              color: "blue",
              marginTop: "80px",
              marginLeft: "600px",
            }}
          />
        </div>
      )}{" "}
      <br />
      <br />
      <Link to={`/register`}>
        <button>Add</button>
      </Link>
      <br />
      <br />
      <input
        type="search"
        placeholder="Search here"
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
      <br />
      <br />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Address</th>
            <th>Status</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Hobbies</th>
            <th>Image</th>
            <th>Designation</th>

            <th>Date(Created)</th>
            <th>Document</th>
            <th colSpan={3}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            // data.map()
            // data.concat()
            data?.length > 0 &&
              data?.map((items, index) => (
                <>
                  {/* {const created= moment(items.createdAt).format('DD-MM-YYYY')} */}
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{items.name}</td>
                    <td>{items.email}</td>
                    <td>{items.age}</td>
                    <td>{items.address}</td>
                    <td>{items.status}</td>
                    <td>{items.gender}</td>
                    <td>{items.phone}</td>
                    <td>{items.hobbies}</td>
                    {/* <td>
                      <img
                        style={{ width: 80, height: 60 }}
                        src={`http://localhost:8083/uploads/${items.image}`}
                      />
                    </td> */}
                    <td>
                      {items.image && items.image.length > 0 ? (
                        <ul>
                          {items.image.map((image, index) => (
                            <li key={index}>
                              <img
                                src={`http://localhost:8083/uploads/${image}`}
                                alt={`items ${items.name} file ${index + 1}`}
                                style={{
                                  width: "25px",
                                  height: "25px",
                                  margin: "5px",
                                }}
                              />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span>No images uploaded</span>
                      )}
                    </td>
                    <td>{items.designation}</td>
                    <td>
                      {moment(items.createdAt).format("YYYY/MM/DD hh:mm:ss")}
                    </td>
                    <td>
                      {items.document && items.document.length > 0 ? (
                        <ul>
                          {items.document.map((document, index) => (
                            <li key={index}>
                              <a
                                href={`http://localhost:8083/documents/${document}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontSize: "12px" }}
                              >
                                {document}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span>No documents uploaded</span>
                      )}
                    </td>
                    <td>
                      <Link to={`/edit/${items._id}`}>
                        <FontAwesomeIcon icon={faEdit} />
                      </Link>
                    </td>
                    <td>
                      <Link to={`/view/${items._id}`}>
                        <FontAwesomeIcon icon={faEye} />
                      </Link>
                    </td>
                    <td>
                      <Link>
                        <FontAwesomeIcon
                          icon={faTrash}
                          onClick={() => {
                            handleDelete(items._id);
                          }}
                        />
                      </Link>
                    </td>
                  </tr>
                </>
              ))
          }
        </tbody>
      </Table>
      {data?.length > 0 && (
        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlepageclick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          activeClassName="active"
        />
      )}
    </>
  );
};

export default List;

// const jwt = require("jsonwebtoken");
// const util = require("util");
// const { syncIndexes } = require("mongoose");
// const SECRET_KEY = "45uhdfg765dcfvj";
// // import { toast } from "react-toastify";
// const auth = async (req, resp, next) => {
//   const tokenHeaders = req.headers["authorization"];
//   if (typeof tokenHeaders !== "undefined") {
//     const bearer = tokenHeaders.split(" ");
//     const token = bearer[1];
//     req.token = token;
//     next();
//   } else {
//     return resp.status(403).json({
//       success: false,
//       message: "unauthorized user",
//     });
//   }
// };
// module.exports = { auth };
