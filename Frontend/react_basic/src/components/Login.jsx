import React, { useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context";

const LoginSchema = Yup.object({
  email: Yup.string()
    .email()
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Invalid email format")
    .required("please provide email"),
  password: Yup.string()
    .min(8, "password must be atleast 8 characters long")
    .required("please enter password"),
});
const initialValues = {
  email: "",
  password: "",
};
const Login = () => {
  const navigate = useNavigate();
  const {storeToken,storeRole,storeProfile} = useContext(AuthContext);
  const { handleChange, handleSubmit, values, errors, touched } = useFormik({
    initialValues: initialValues,
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      // console.log(values.password);
      // const email=values.email
      // const password=values.password
      const data = await axios.get("http://localhost:8083/api/employee/login", {
        params: {
          email: values.email,
          password: values.password,
        },
      });
      console.log(data)
      console.log(data.data.data.role);
      if (data.data.success) {
        alert("login successfully");
        storeToken(data.data.token);
        storeRole(data.data.data.role);
        storeProfile(data.data.data.profileImage)
        // localStorage.setItem("data",data.data.role );
        navigate("/list");
      }
      console.log(data.data.success);
    },
  });
  return (
    <>
      <br />
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          onChange={handleChange}
          value={values.email}
        />{" "}
        <br />
        {errors.email && touched.email ? (
          <span style={{ color: "red" }}>{errors.email}</span>
        ) : null}
        <br />
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          onChange={handleChange}
          value={values.password}
        />{" "}
        <br />
        {errors.password && touched.password ? (
          <span style={{ color: "red" }}>{errors.password}</span>
        ) : null}
        <br />
        <button type="submit">Login</button>
        <a href="/forgot">Forgot Password</a>
      </form>
    </>
  );
};

export default Login;
