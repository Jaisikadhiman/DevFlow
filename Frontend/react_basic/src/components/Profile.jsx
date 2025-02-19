import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useParams, useNavigate } from "react-router-dom";
import Navvv from "../Nav/Navvv";
const EditSchema = Yup.object({
  name: Yup.string()
    .min(2, "name contains atleast 2 characters")
    .max(20, "name can contain max 20 characters")
    .required("please enter name"),
  email: Yup.string()
    .email()
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Invalid email format")
    .required("please provide email"),
  age: Yup.number().required("please enter age"),
  address: Yup.string()
    .min(2, "name contains atleast 2 characters")
    .max(20, "name can contain max 20 characters")
    .required("please enter address"),
  gender: Yup.string().oneOf(["Male", "Female"]).required("please fill gender"),
  // image: Yup.mixed().required("A file is required"),
  profileImage: Yup.mixed().required("A file is required"),
  // .test("fileSize", "File size is too large", (value) => {
  //   return value && value.size <= MAX_FILE_SIZE;
  // })
  // .test("fileFormat", "Unsupported file format", (value) => {
  //   return value && isValidFileType(value.name);
  // }),
});
const Profile = () => {
  // const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [token, setToken] = useState("");
  const [path, setPath] = useState(
    "data:image/jpeg;base64,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"
  );
  // const [imagePreview, setImagePreview] = useState(employee.profileImage ? `http://your-domain.com/ProfileImage/${employee.profileImage}` : null); // default image if available

  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    age: "",
    address: "",
    gender: "",
    phone: "",
    profileImage: null,
  });
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const data = localStorage.getItem("token");
    setToken(data);
    const decoded = jwtDecode(data);
    console.log(decoded);
    console.log(token);
    const id = decoded.data._id;

    try {
      const resp = await axios.get(
        `http://localhost:8083/api/employee/getOne/${id}`
      );
      const detail = resp.data.data;
      // setPath(`http://localhost:8083/profileImages/${detail.profileImage}`);

      console.log(detail);
      if (resp.status === 200) {
        setInitialValues({
          name: detail.name,
          email: detail.email,
          age: detail.age,
          address: detail.address,
          gender: detail.gender,
          phone: detail.phone,
          // profileImage: detail.profileImage || path,
          profileImage: detail.profileImage
            ? `http://localhost:8083/profileImages/${detail.profileImage}`
            : path,
        });
        if (detail.profileImage) {
          setPath(`http://localhost:8083/profileImages/${detail.profileImage}`);
        }
        // else {
        //   setPath("default/path/to/image.jpg"); // Fallback image if none exists
        // }

        //  { if(!profileImage === "default-file-path"){
        // setPath(`http://localhost:8083/profileImages/${detail.profileImage}`);
        //   }}
      }
    } catch (error) {
      console.log(error);
    }
  };
  const formik = useFormik({
    initialValues,
    validationSchema: EditSchema,
    enableReinitialize: true,

    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("age", values.age);
      formData.append("address", values.address);
      formData.append("gender", values.gender);
      formData.append("phone", values.phone);
      // formData.append("profileImage", selectedImage);

      // Append image if it's selected, otherwise retain the existing image
      if (selectedImage) {
        formData.append("profileImage", selectedImage);
      }

      console.log("formData");
      const resp = await axios.post(
        `http://localhost:8083/api/employee/editProfile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(resp.data.data.profileImage);
      if (resp.status === 200) {
        alert("updated successfully");
        resetForm();
        navigate("/profile");
        localStorage.setItem("profileImg", resp.data.data.profileImage);
        // <Navvv image={selectedImage}/>
      }
      console.log("response" + resp.status);
    },
  });
  console.log(formik.errors);
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedImage(file);
      setPath(URL.createObjectURL(file)); // Preview the image
    }
  };
  const mainDiv = {
    display: "flex",
    justifyContent: "space-around", // Keep space between left and right sections
    alignItems: "center",
    padding: "10px",
  };
  const imageElement = {
    height: "150px",
    width: "150px",
  };
  return (
    <div style={mainDiv}>
      <div>
        <img style={imageElement} src={path} />
      </div>
      <div>
        <>
          {/* <Navvv image={selectedImage}/> */}

          <form onSubmit={formik.handleSubmit}>
            <label style={{ fontSize: 20, color: "black" }}>Name: </label>
            <input
              style={{ marginLeft: 50, borderRadius: 5 }}
              type="text"
              name="name"
              value={formik.values.name}
              placeholder=""
              onChange={formik.handleChange}
            />
            <br />
            {formik.errors.name && formik.touched.name ? (
              <span style={{ color: "red" }}>{formik.errors.name}</span>
            ) : null}
            <br />
            <label style={{ fontSize: 20, color: "black" }}>Email: </label>
            <input
              style={{ marginLeft: 50, borderRadius: 5 }}
              type="email"
              name="email"
              value={formik.values.email}
              placeholder=""
              onChange={formik.handleChange}
            />
            <br />
            {formik.errors.email && formik.touched.email ? (
              <span style={{ color: "red" }}>{formik.errors.email}</span>
            ) : null}
            <br />
            <label style={{ fontSize: 20, color: "black" }}>Age: </label>
            <input
              style={{ marginLeft: 50, borderRadius: 5 }}
              type="Number"
              name="age"
              value={formik.values.age}
              placeholder=""
              onChange={formik.handleChange}
            />
            <br />
            {formik.errors.age && formik.touched.age ? (
              <span style={{ color: "red" }}>{formik.errors.age}</span>
            ) : null}
            <br />
            <label style={{ fontSize: 20, color: "black" }}>Address: </label>
            <input
              style={{ marginLeft: 50, borderRadius: 5 }}
              type="address"
              name="address"
              value={formik.values.address}
              placeholder=""
              onChange={formik.handleChange}
            />
            <br />
            {formik.errors.address && formik.touched.address ? (
              <span style={{ color: "red" }}>{formik.errors.address}</span>
            ) : null}
            <br />
            <label style={{ fontSize: 20, color: "black" }}>Gender: </label>
            <input
              style={{ marginLeft: 50, borderRadius: 5 }}
              type="radio"
              name="gender"
              value="Male"
              onChange={formik.handleChange}
              checked={formik.values.gender === "Male"}
            />
            Male
            <input
              style={{ marginLeft: 50, borderRadius: 5 }}
              type="radio"
              name="gender"
              value="Female"
              onChange={formik.handleChange}
              checked={formik.values.gender === "Female"}
            />
            Female
            <br />
            {formik.errors.gender && formik.touched.gender ? (
              <span style={{ color: "red" }}>{formik.errors.gender}</span>
            ) : null}
            <br />
            <label style={{ fontSize: 20, color: "black" }}>Phone: </label>
            <input
              style={{ marginLeft: 50, borderRadius: 5 }}
              type="phone"
              name="phone"
              value={formik.values.phone}
              placeholder=""
              onChange={formik.handleChange}
            />
            <br />
            {formik.errors.phone && formik.touched.phone ? (
              <span style={{ color: "red" }}>{formik.errors.phone}</span>
            ) : null}
            <br />
            <label style={{ fontSize: 20, color: "black" }}>
              Select Profile Image:{" "}
            </label>
            <br />
            <input
              type="file"
              name="profileImage"
              onChange={handleImageChange}
            />
            {/* {existingFile && !values.file && (
              <img
                style={{ width: 80, height: 60 }}
                src={`http://localhost:8083/uploads/${existingFile}`}
              />
              // <img  style={{width:80, height:60}} src={`http://localhost:8083/uploads/${items.image}` />
              // <p>Existing file: {existingFile}</p> // Show existing file name
            )} */}
            <br />
            {formik.errors.file && formik.touched.file ? (
              <span style={{ color: "red" }}>{formik.errors.file}</span>
            ) : null}
            <br />
            <button type="submit">Edit</button>
          </form>
        </>
      </div>
    </div>
  );
};

export default Profile;
