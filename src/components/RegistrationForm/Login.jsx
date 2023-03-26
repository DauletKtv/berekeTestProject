import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import InputMask from "react-input-mask";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setIsLoged } from "../../redux/loginSlice";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const initialValues = {
    phoneNumber: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .matches(/^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/, "Invalid phone number"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values) => {
    const cleanedNumber = values.phoneNumber.replace(/\D/g, "");

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:5136/User/Login`, {
        params: { PhoneNumber: cleanedNumber, Password: values.password },
      });
      if (response.data) {
        localStorage.setItem("isLoged", true);
        dispatch(setIsLoged(true));
        navigate("/dashboard");
      } else {
        setError("Не верный логи или пароль");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container logBlock">
      <h1>Вход</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <div className="mb-3">
              <label htmlFor="phoneNumber" className="form-label">
                Номер телефона
              </label>
              <Field
                type="text"
                name="phoneNumber"
                className={`form-control ${
                  errors.phoneNumber && touched.phoneNumber ? "is-invalid" : ""
                }`}
                as={InputMask}
                mask="+7 (999) 999-99-99"
                placeholder="+7 (___) ___-__-__"
              />
              {errors.phoneNumber && touched.phoneNumber ? (
                <div className="invalid-feedback">{errors.phoneNumber}</div>
              ) : null}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Пароль
              </label>
              <Field
                type="password"
                name="password"
                className={`form-control ${
                  errors.password && touched.password ? "is-invalid" : ""
                }`}
              />
              <ErrorMessage name="password" className="invalid-feedback" />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Загрузка..." : "Войти"}
            </button>
            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                {error}
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
