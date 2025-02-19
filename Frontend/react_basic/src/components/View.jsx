import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
// const validFileExtensions = [
//   "jpg",
//   "gif",
//   "png",
//   "jpeg",
//   "svg",
//   "webp",
//   "jfif",
// ];

// const isValidFileType = (fileName) => {
//   return fileName && validFileExtensions.includes(fileName.split(".").pop());
// };

// const ViewSchema = Yup.object({
//   name: Yup.string()
//     .min(2, "name contains atleast 2 characters")
//     .max(20, "name can contain max 20 characters")
//     .required("please enter name"),
//   email: Yup.string()
//     .email()
//     .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Invalid email format")
//     .required("please provide email"),
//   age: Yup.number().required("please enter age"),
//   designation: Yup.string().required("please enter designation"),
//   address: Yup.string()
//     .min(2, "name contains atleast 2 characters")
//     .max(20, "name can contain max 20 characters")
//     .required("please enter address"),
//   gender: Yup.string().oneOf(["Male", "Female"]).required("please fill gender"),
//   status: Yup.string()
//     .oneOf(["active", "pending"])
//     .required("Please enter status"),
//   // status: Yup.mixed().required("Please enter status"),

//   hobbies: Yup.array()
//     .of(Yup.string().required())
//     .min(1, "Provide at least 1 hobby")
//     .max(4, "Max 4 hobbies allowed")
//     .required("Please select hobbies"),
//   file: Yup.mixed()
//     .required("A file is required")
//     .test("fileSize", "File size is too large", (value) => {
//       return value && value.size <= MAX_FILE_SIZE;
//     })
//     .test("fileFormat", "Unsupported file format", (value) => {
//       return value && isValidFileType(value.name);
//     }),
// });
const View = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [existingFile, setExistingFile] = useState(null);
  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    age: "",
    address: "",
    status: "",
    gender: "",
    phone: "",
    hobbies: [],
    file: null,
    designation: "",
    // fileName: "",
  });
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const resp = await axios.get(
      `http://localhost:8083/api/employee/getOne/${id}`
    );

    const detail = resp.data.data;
    console.log(resp);
    console.log(detail);
    setInitialValues({
      name: detail.name,
      email: detail.email,
      age: detail.age,
      address: detail.address,
      status: detail.status,
      gender: detail.gender,
      phone: detail.phone,
      hobbies: detail.hobbies,
      // fileName: detail.file,
      //  file: existingFile,
      designation: detail.designation,
    });
    setExistingFile(detail.file);
    // console.log("resp" + " " + values.file);
  };

  const { values, handleChange, handleSubmit, errors, setFieldValue, touched } =
    useFormik({
      initialValues: initialValues,
      // validationSchema: ViewSchema,
      // enableReinitialize: true,
      // onSubmit: async (values, { resetForm }) => {
      //   console.log(values);
      //   const resp = await axios.post(
      //     `http://localhost:8083/api/employee/update/${id}`,
      //     values
      //     // {
      //     //   headers: {
      //     //     "Content-Type": "multipart/form-data",
      //     //   },
      //     // }
      //   );
      //   if (resp.status === 200) {
      //     alert("updated successfully");
      //     resetForm();
      //     navigate("/list");
      //   }
      //   console.log("response" + resp.status);
      // },
    });
  return (
    <>
      <form >
        <label style={{ fontSize: 20, color: "black" }}>Name: </label>
        <input
          style={{ marginLeft: 50, borderRadius: 5 }}
          type="text"
          name="name"
          value={initialValues.name}
          placeholder=""
          onChange={handleChange}
        />
        <br />
        {errors.name && touched.name ? (
          <span style={{ color: "red" }}>{errors.name}</span>
        ) : null}
        <br />
        <label style={{ fontSize: 20, color: "black" }}>Email: </label>
        <input
          style={{ marginLeft: 50, borderRadius: 5 }}
          type="email"
          name="email"
          value={initialValues.email}
          placeholder=""
          // onChange={handleChange}
        />
        <br />
        {errors.email && touched.email ? (
          <span style={{ color: "red" }}>{errors.email}</span>
        ) : null}
        <br />
        <label style={{ fontSize: 20, color: "black" }}>Age: </label>
        <input
          style={{ marginLeft: 50, borderRadius: 5 }}
          type="Number"
          name="age"
          value={initialValues.age}
          placeholder=""
          // onChange={handleChange}
        />
        <br />
        {errors.age && touched.age ? (
          <span style={{ color: "red" }}>{errors.age}</span>
        ) : null}
        <br />
        <label style={{ fontSize: 20, color: "black" }}>Designation: </label>
        <input
          style={{ marginLeft: 50, borderRadius: 5 }}
          type="text"
          name="designation"
          value={initialValues.designation}
          placeholder=""
          // onChange={handleChange}
        />
        <br />
        {errors.designation && touched.designation ? (
          <span style={{ color: "red" }}>{errors.designation}</span>
        ) : null}
        <br />
        <label style={{ fontSize: 20, color: "black" }}>address: </label>
        <input
          style={{ marginLeft: 50, borderRadius: 5 }}
          type="address"
          name="address"
          value={initialValues.address}
          placeholder=""
          // onChange={handleChange}
        />
        <br />
        {errors.address && touched.address ? (
          <span style={{ color: "red" }}>{errors.address}</span>
        ) : null}
        <br />
        <label style={{ fontSize: 20, color: "black" }}>Gender: </label>
        <input
          style={{ marginLeft: 50, borderRadius: 5 }}
          type="radio"
          name="gender"
          value="Male"
          // onChange={handleChange}
          checked={initialValues.gender === "Male"}
        />
        Male
        <input
          style={{ marginLeft: 50, borderRadius: 5 }}
          type="radio"
          name="gender"
          value="Female"
          // onChange={handleChange}
          checked={initialValues.gender === "Female"}
        />
        Female
        <br />
        {errors.gender && touched.gender ? (
          <span style={{ color: "red" }}>{errors.gender}</span>
        ) : null}
        <br />
        <label style={{ fontSize: 20, color: "black" }}>Phone: </label>
        <input
          style={{ marginLeft: 50, borderRadius: 5 }}
          type="phone"
          name="phone"
          value={initialValues.phone}
          placeholder=""
          // onChange={handleChange}
        />
        <br />
        {errors.phone && touched.phone ? (
          <span style={{ color: "red" }}>{errors.phone}</span>
        ) : null}
        <br />
        <label style={{ fontSize: 20, color: "black" }}>Status: </label>
        <select name="status" value={initialValues.status} onChange={handleChange}>
          <option value="">Select Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
        </select>
        <br />
        {errors.status && touched.status ? (
          <span style={{ color: "red" }}>{errors.status}</span>
        ) : null}
        <label style={{ fontSize: 20, color: "black" }}>Hobbies: </label>
        <br />
        <br />
        <input
          type="checkbox"
          name="hobbies"
          value="playing"
          checked={initialValues.hobbies.includes("playing")}
          placeholder=""
          onChange={handleChange}
        />
        <label>Playing </label>
        <input
          type="checkbox"
          name="hobbies"
          value="gaming"
          checked={initialValues.hobbies.includes("gaming")}
          placeholder=""
          onChange={handleChange}
        />
        Gaming
        <br />
        <br />
        <input
          type="checkbox"
          name="hobbies"
          value="traveling"
          checked={initialValues.hobbies.includes("traveling")}
          placeholder=""
          onChange={handleChange}
        />
        Traveling
        <br />
        <br />
        <input
          type="checkbox"
          name="hobbies"
          value={"singing"}
          checked={initialValues.hobbies.includes("singing")}
          placeholder=""
          onChange={handleChange}
        />
        Singing
        <br />
        <br />
        {errors.hobbies && touched.hobbies ? (
          <span style={{ color: "red" }}>{errors.hobbies}</span>
        ) : null}
        <label style={{ fontSize: 20, color: "black" }}>Select File: </label>
        <br />
        <input
          type="file"
          name="file"
          onChange={(event) => {
            setFieldValue("file", event.target.files[0]);
          }}
        />
        {existingFile && !initialValues.file && (
          <p>Existing file: {existingFile}</p> // Show existing file name
        )}
        <br />
        {errors.file && touched.file ? (
          <span style={{ color: "red" }}>{errors.file}</span>
        ) : null}
        <br />
      </form>
    </>
  );
};

export default View;
