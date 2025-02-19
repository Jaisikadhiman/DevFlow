import React, { useContext, useState } from "react";
import { Field, useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "./context";
import { useNavigate } from "react-router-dom";
// import DateTimePicker from "react-datetime-picker";
// import "react-datetime-picker/dist/DateTimePicker.css";

import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

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

// const isValidFileType = (fileName) => {
//   return fileName && validFileExtensions.includes(fileName.split(".").pop());
// };

const RegisterSchema = Yup.object({
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
  password: Yup.string()
    .min(8, "password must be atleast 8 characters long")
    .required("please enter password"),
  status: Yup.string()
    .oneOf(["active", "inactive"])
    .required("Please enter status"),
  role: Yup.string()
    .oneOf(["admin", "customer", "editor"])
    .required("Please enter role"),
  // status: Yup.mixed().required("Please enter status"),

  hobbies: Yup.array()
    .of(Yup.string().required())
    .min(1, "Provide at least 1 hobby")
    .max(4, "Max 4 hobbies allowed")
    .required("Please select hobbies"),
  image: Yup.mixed().required("A file is required"),
  // .test("fileSize", "File size is too large", (value) => {
  //   return value && value.size <= MAX_FILE_SIZE;
  // })
  // .test("fileFormat", "Unsupported file format", (value) => {
  //   return value && isValidFileType(value.name);
  // }),
  document: Yup.mixed().required("A file is required"),
  dobTime: Yup.date().required("please enter Dob and Time"),
});
// matches(/^[0-9]+$/, 'Phone number is not valid')phone validation
const initialValues = {
  name: "",
  email: "",
  age: "",
  address: "",
  password: "",
  status: "",
  gender: "",
  phone: "",
  hobbies: [],
  image: null,
  document: null,
  designation: "",
  dobTime: "",
};
const Register = () => {
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [dobTime, setDobTime] = useState(new Date());
  // const dobTime=Date.now();

  // const {storeToken}=useContext(AuthContext);
  // const { values, formik.handleChange, handleSubmit, formik.errors, setFieldValue, formik.touched } =
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: RegisterSchema,
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("age", values.age);
      formData.append("designation", values.designation);
      formData.append("address", values.address);
      formData.append("gender", values.gender);
      formData.append("password", values.password);
      formData.append("phone", values.phone);
      formData.append("status", values.status);
      formData.append("role", values.role);
      formData.append("dobTime", dobTime);
      // formData.append("hobbies", values.hobbies);
      values.hobbies.forEach((hobby) => {
        formData.append("hobbies[]", hobby);
      });

      // Append multiple images
      for (let i = 0; i < values.image.length; i++) {
        formData.append("image", values.image[i]);
      }

      // Append multiple documents
      for (let i = 0; i < values.document.length; i++) {
        formData.append("document", values.document[i]);
      }
      console.log(formik.values);
      console.log(formData);
      const resp = await axios.post(
        "http://localhost:8083/api/employee/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log(resp.data.token);
      // console.log(resp.data.message);
      if (resp.data.success) {
        // storeToken(resp.data.token)
        // localStorage.setItem("token",resp.data.token)
        toast.success(resp.data.message);
        // alert("successfully registered");
        resetForm();
        navigate("/list");
      } else {
        toast.error(resp.data.message);
      }
    },
  });
  const handleImageChange = (event) => {
    formik.setFieldValue("image", event.currentTarget.files);
  };

  const handleDocumentChange = (event) => {
    formik.setFieldValue("document", event.currentTarget.files);
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
        <label style={{ fontSize: 20, color: "black" }}>Password</label>
        <input
          style={{ marginLeft: 50, borderRadius: 5 }}
          type="password"
          name="password"
          value={formik.values.password}
          placeholder=""
          onChange={formik.handleChange}
        />
        <br />
        {formik.errors.password && formik.touched.password ? (
          <span style={{ color: "red" }}>{formik.errors.password}</span>
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
        <select
          name="status"
          value={formik.values.status}
          onChange={formik.handleChange}
        >
          <option value="">Select Status</option>
          <option value="active">Active</option>
          <option value="inactive">Pending</option>
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
          placeholder=""
          checked={formik.values.hobbies.includes("playing")}
          // onChange={(e) => {
          //   if (e.target.checked) {
          //     setFieldValue("hobbies", [...formik.values.hobbies, e.target.value]);
          //   } else {
          //     setFieldValue(
          //       "hobbies",
          //       formik.values.hobbies.filter((hobby) => hobby !== e.target.value)
          //     );
          //   }
          // }}
          onChange={formik.handleChange}
        />
        <label>Playing </label>
        <input
          type="checkbox"
          name="hobbies"
          value="gaming"
          placeholder=""
          checked={formik.values.hobbies.includes("gaming")}
          // onChange={(e) => {
          //   if (e.target.checked) {
          //     setFieldValue("hobbies", [...formik.values.hobbies, e.target.value]);
          //   } else {
          //     setFieldValue(
          //       "hobbies",
          //       formik.values.hobbies.filter((hobby) => hobby !== e.target.value)
          //     );
          //   }
          // }}
          onChange={formik.handleChange}
        />
        Gaming
        <br />
        <br />
        <input
          type="checkbox"
          name="hobbies"
          value="traveling"
          placeholder=""
          checked={formik.values.hobbies.includes("traveling")}
          // onChange={(e) => {
          //   if (e.target.checked) {
          //     setFieldValue("hobbies", [...formik.values.hobbies, e.target.value]);
          //   } else {
          //     setFieldValue(
          //       "hobbies",
          //       formik.values.hobbies.filter((hobby) => hobby !== e.target.value)
          //     );
          //   }
          // }}
          onChange={formik.handleChange}
        />
        Traveling
        <br />
        <br />
        <input
          type="checkbox"
          name="hobbies"
          value="singing"
          placeholder=""
          checked={formik.values.hobbies.includes("singing")}
          // onChange={(e) => {
          //   if (e.target.checked) {
          //     setFieldValue("hobbies", [...formik.values.hobbies, e.target.value]);
          //   } else {
          //     setFieldValue(
          //       "hobbies",
          //       formik.values.hobbies.filter((hobby) => hobby !== e.target.value)
          //     );
          //   }
          // }}
          onChange={formik.handleChange}
        />
        Singing
        <br />
        <br />
        {formik.errors.hobbies && formik.touched.hobbies ? (
          <span style={{ color: "red" }}>{formik.errors.hobbies}</span>
        ) : null}
        <label style={{ fontSize: 20, color: "black" }}>Select Image: </label>
        <br />
        <input
          type="file"
          name="image"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
        <br />
        {formik.errors.image && formik.touched.image ? (
          <span style={{ color: "red" }}>{formik.errors.image}</span>
        ) : null}
        <br />
        <label style={{ fontSize: 20, color: "black" }}>Role: </label>
        <select
          name="role"
          value={formik.values.role}
          onChange={formik.handleChange}
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
          <option value="editor">Editor</option>
        </select>
        <br />
        {formik.errors.status && formik.touched.status ? (
          <span style={{ color: "red" }}>{formik.errors.status}</span>
        ) : null}
        <br />
        <label style={{ fontSize: 20, color: "black" }}>
          Select Document:{" "}
        </label>
        <br />
        <input
          type="file"
          name="document"
          accept=".pdf,.doc,.docx"
          multiple
          onChange={handleDocumentChange}
        />
        <br />
        {formik.errors.document && formik.touched.document ? (
          <span style={{ color: "red" }}>{formik.errors.document}</span>
        ) : null}
        <br />
        <label style={{ fontSize: 20, color: "black" }}>
          Select Date And Time:
        </label>
        {/* <DateTimePicker
          onChange={(val) => formik.setFieldValue("dobTime", val)}
          value={formik.values.dobTime}
        /> */}
        {/* <DateTimePicker
        name="dobTime"
        onChange={(val) => {
          setDobTime(val); // Update local state
          formik.setFieldValue("dobTime", val); // Update Formik's state
        }}
        value={dobTime} // Bind value to local state
        format="y-MM-dd h:mm a"

      /> */}
      <Datetime 
        name="dobTime"
        value={formik.values.dobTime}
        onChange={(val) => {
          formik.setFieldValue('dobTime', val.toDate()); // Update Formik's state
        }}
        dateFormat="YYYY-MM-DD"
        timeFormat="HH:mm"
        inputProps={{ style: { width:"300px", borderRadius: '5px', border: '1px solid #ddd', padding: '8px', fontSize: '16px' } }}

      />
        <br />
        {formik.errors.dobTime && formik.touched.dobTime ? (
          <span style={{ color: "red" }}>{formik.errors.dobTime}</span>
        ) : null}
        <br />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default Register;
