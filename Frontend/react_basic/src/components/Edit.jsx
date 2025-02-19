import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
const MAX_FILE_SIZE = 102400 + 102400; // 200KB
const validFileExtensions = [
  "jpg",
  "gif",
  "png",
  "jpeg",
  "svg",
  "webp",
  "jfif",
];
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
  designation: Yup.string().required("please enter designation"),
  address: Yup.string()
    .min(2, "name contains atleast 2 characters")
    .max(20, "name can contain max 20 characters")
    .required("please enter address"),
  gender: Yup.string().oneOf(["Male", "Female"]).required("please fill gender"),
  status: Yup.string()
    .oneOf(["active", "pending"])
    .required("Please enter status"),

  hobbies: Yup.array()
    .of(Yup.string().required())
    .min(1, "Provide at least 1 hobby")
    .max(4, "Max 4 hobbies allowed")
    .required("Please select hobbies"),
  image: Yup.mixed()
    .required("A file is required")
    // .test("fileSize", "File size is too large", (value) => {
    //   return value && value.size <= MAX_FILE_SIZE;
    // })
    // .test("fileFormat", "Unsupported file format", (value) => {
    //   return value && isValidFileType(value.name);
    // }),
});
const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [existingFiles, setExistingFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    age: "",
    address: "",
    status: "",
    gender: "",
    phone: "",
    hobbies: [],
    image: null,
    designation: "",
  });

  useEffect(() => {
    fetchData();
  }, [id]);
  const fetchData = async () => {
    try {
      const resp = await axios.get(
        `http://localhost:8083/api/employee/getOne/${id}`
      );
      const detail = resp.data.data;

      if (resp.status === 200) {
        setInitialValues({
          name: detail.name,
          email: detail.email,
          age: detail.age,
          address: detail.address,
          status: detail.status,
          gender: detail.gender,
          phone: detail.phone,
          hobbies: detail.hobbies,
          designation: detail.designation,
          image: detail.image || [],
        });
        setExistingFiles(
          detail.image.map((file) => `http://localhost:8083/uploads/${file}`)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  const formik =
  useFormik({
    initialValues,
    validationSchema: EditSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("age", values.age);
      formData.append("address", values.address);
      formData.append("status", values.status);
      formData.append("gender", values.gender);
      formData.append("phone", values.phone);
      values.hobbies.forEach((hobby) => {
        formData.append("hobbies[]", hobby);
      });
      for (let i = 0; i < newFiles.length; i++) {
        formData.append("image", newFiles[i]);
      }
      // for (let i = 0; i < values.image.length; i++) {
      //   formData.append("image", values.image[i]);
      // }
      // values.image.forEach((file) => {
      //   formData.append("image", file); // Append each image
      // });
      formData.append("designation", values.designation);
   
      console.log(formData);
      const resp = await axios.post(
        `http://localhost:8083/api/employee/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (resp.status === 200) {
        alert("updated successfully");
        resetForm();
        navigate("/list");
      }
      console.log("response" + resp.status);
    },
  });

  const handleFileChange = (event) => {
    const files = event.target.files;
    const fileArray = Array.from(files);
        setNewFiles(fileArray); // Set the new files

    formik.setFieldValue("image", fileArray); // Store multiple files in state
    setExistingFiles(fileArray.map((file) => URL.createObjectURL(file))); // Preview new images
  };
  
  
  return (
    <>
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
        <label style={{ fontSize: 20, color: "black" }}>Designation: </label>
        <input
          style={{ marginLeft: 50, borderRadius: 5 }}
          type="text"
          name="designation"
          value={formik.values.designation}
          placeholder=""
          onChange={formik.handleChange}
        />
        <br />
        {formik.errors.designation && formik.touched.designation ? (
          <span style={{ color: "red" }}>{formik.errors.designation}</span>
        ) : null}
        <br />
        <label style={{ fontSize: 20, color: "black" }}>address: </label>
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
        <label style={{ fontSize: 20, color: "black" }}>Status: </label>
        <select name="status" value={formik.values.status} onChange={formik.handleChange}>
          <option value="">Select Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
        </select>
        <br />
        {formik.errors.status && formik.touched.status ? (
          <span style={{ color: "red" }}>{formik.errors.status}</span>
        ) : null}
        <label style={{ fontSize: 20, color: "black" }}>Hobbies: </label>
        <br />
        <br />
        <input
          type="checkbox"
          name="hobbies"
          value="playing"
          checked={formik.values.hobbies.includes("playing")}
          placeholder=""
          onChange={formik.handleChange}
        />
        <label>Playing </label>
        <input
          type="checkbox"
          name="hobbies"
          value="gaming"
          checked={formik.values.hobbies.includes("gaming")}
          placeholder=""
          onChange={formik.handleChange}
        />
        Gaming
        <br />
        <br />
        <input
          type="checkbox"
          name="hobbies"
          value="traveling"
          checked={formik.values.hobbies.includes("traveling")}
          placeholder=""
          onChange={formik.handleChange}
        />
        Traveling
        <br />
        <br />
        <input
          type="checkbox"
          name="hobbies"
          value={"singing"}
          checked={formik.values.hobbies.includes("singing")}
          placeholder=""
          onChange={formik.handleChange}
        />
        Singing
        <br />
        <br />
        {formik.errors.hobbies && formik.touched.hobbies ? (
          <span style={{ color: "red" }}>{formik.errors.hobbies}</span>
        ) : null}
        <label style={{ fontSize: 20, color: "black" }}>Select File: </label>
        <br />
        {/* <input
          type="file"
          name="image"
          onChange={(event) => {
            setFieldValue("image", event.target.files[0]);
          }}
        />
        {existingFile && !values.file && (
          <img style={{width:80, height:60}} src={`http://localhost:8083/uploads/${existingFile}`}/>
          // <img  style={{width:80, height:60}} src={`http://localhost:8083/uploads/${items.image}` />
          // <p>Existing file: {existingFile}</p> // Show existing file name
        )} */}
        <input
          type="file"
          name="image"
          accept="image/*"
          multiple
          onChange={handleFileChange}
       
        />
        <div>
          {existingFiles.map((file, index) => (
            <img
              key={index}
              src={file}
              alt={`Preview ${index}`}
              style={{ width: "100px", height: "100px", marginRight: "10px" }}
            />
          ))}
        </div>

        <br />
        {formik.errors.file && formik.touched.file ? (
          <span style={{ color: "red" }}>{formik.errors.file}</span>
        ) : null}
        <br />
        <button type="submit">Edit</button>
      </form>
    </>
  );
};
export default Edit;

