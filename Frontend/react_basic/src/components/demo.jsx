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

const isValidFileType = (fileName) => {
  return fileName && validFileExtensions.includes(fileName.split(".").pop());
};

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
    .test("fileSize", "File size is too large", (value) => {
      return value && value.size <= MAX_FILE_SIZE;
    })
    .test("fileFormat", "Unsupported file format", (value) => {
      return value && isValidFileType(value.name);
    }),
});
// matches(/^[0-9]+$/, 'Phone number is not valid')phone validation

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [existingFiles, setExistingFiles] = useState([]);
  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    age: "",
    address: "",
    status: "",
    gender: "",
    phone: "",
    hobbies: [],
    image: [],
    designation: "",
    // fileName: "",
    // image
  });
  useEffect(() => {
    fetchData();
    console.log("existing file" + typeof existingFiles);
  }, [id]);
  const fetchData = async () => {
    const resp = await axios.get(
      `http://localhost:8083/api/employee/getOne/${id}`
    );

    const detail = resp.data.data;
    // console.log(resp);
    // console.log(detail.file);
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
      // image:detail.file
    });
    // console.log(image);
    setExistingFiles(detail.image.map(file => `http://localhost:8083/uploads/${file}`)); 
   
    // setExistingFile(`http://localhost:8083/uploads/${detail.image}`);
    // console.log("resp" + " " + values.file);
  };

  const { values, handleSubmit, errors, setFieldValue, touched } =
    useFormik({
      initialValues,
      validationSchema: EditSchema,
      enableReinitialize: true,
      onSubmit: async (values, { resetForm }) => {
        const formData = new FormData();
        
        Object.keys(values).forEach((key) => {
          if (key === 'image') {
            values.image.forEach((file) => formData.append('image', file));
          } else {
            formData.append(key, values[key]);
          }
        });
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
      setFieldValue("image", fileArray); // Store multiple files in state
      setExistingFiles(fileArray.map((file) => URL.createObjectURL(file))); // Preview new images
    };
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setInitialValues({
        ...initialValues,
        [name]: value,
      });
    };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <label style={{ fontSize: 20, color: "black" }}>Name: </label>
        <input
          style={{ marginLeft: 50, borderRadius: 5 }}
          type="text"
          name="name"
          value={values.name}
          placeholder=""
          onChange={handleInputChange}
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
          value={values.email}
          placeholder=""
          onChange={handleInputChange}
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
          value={values.age}
          placeholder=""
          onChange={handleInputChange}
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
          value={values.designation}
          placeholder=""
          onChange={handleInputChange}
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
          value={values.address}
          placeholder=""
          onChange={handleInputChange}
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
          onChange={handleInputChange}
          checked={values.gender === "Male"}
        />
        Male
        <input
          style={{ marginLeft: 50, borderRadius: 5 }}
          type="radio"
          name="gender"
          value="Female"
          onChange={handleInputChange}
          checked={values.gender === "Female"}
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
          value={values.phone}
          placeholder=""
          onChange={handleInputChange}
        />
        <br />
        {errors.phone && touched.phone ? (
          <span style={{ color: "red" }}>{errors.phone}</span>
        ) : null}
        <br />
        <label style={{ fontSize: 20, color: "black" }}>Status: </label>
        <select name="status" value={values.status} onChange={handleInputChange}>
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
          checked={values.hobbies.includes("playing")}
          placeholder=""
          onChange={handleInputChange}
        />
        <label>Playing </label>
        <input
          type="checkbox"
          name="hobbies"
          value="gaming"
          checked={values.hobbies.includes("gaming")}
          placeholder=""
          onChange={handleInputChange}
        />
        Gaming
        <br />
        <br />
        <input
          type="checkbox"
          name="hobbies"
          value="traveling"
          checked={values.hobbies.includes("traveling")}
          placeholder=""
          onChange={handleInputChange}
        />
        Traveling
        <br />
        <br />
        <input
          type="checkbox"
          name="hobbies"
          value={"singing"}
          checked={values.hobbies.includes("singing")}
          placeholder=""
          onChange={handleInputChange}
        />
        Singing
        <br />
        <br />
        {errors.hobbies && touched.hobbies ? (
          <span style={{ color: "red" }}>{errors.hobbies}</span>
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
          // onChange={(event) => {
          //   const file = event.target.files[0];
          //   if (file) {
          //     setFieldValue("image", file);
          //     setExistingFile(URL.createObjectURL(file));
          //   }
          // }}
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

        {/* {existingFile && (
          <img
            // src={existingFile}
            src={
              typeof existingFile === "string"
                ? existingFile
                : URL.createObjectURL(existingFile)
            }
            alt="preview"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50px",
            }}
          />
        )} */}
        <br />
        {errors.file && touched.file ? (
          <span style={{ color: "red" }}>{errors.file}</span>
        ) : null}
        <br />
        <button type="submit">Edit</button>
      </form>
    </>
  );
};

export default Edit;
