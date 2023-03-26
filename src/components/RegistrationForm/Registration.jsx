import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import InputMask from "react-input-mask";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setIsLoged } from "../../redux/loginSlice";
import { useNavigate } from "react-router-dom";
const Registration = () => {
  const [successAlet, setSuccsessAlert] = useState(false);
  const logState = useSelector((state) => state.log);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className="logBlock container">
      {successAlet == true ? (
        <div className="alert alert-success" role="alert">
          Вы успешно зарегистрировались
        </div>
      ) : null}

      <h1>Регистрация</h1>
      <Formik
        initialValues={{
          name: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().required("Это обязатльное поле!"),
          phoneNumber: Yup.string()
            .matches(
              /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/,
              "Заполните номер полностью!"
            )
            .required("Это обязатльное поле!"),
          password: Yup.string()
            .min(8, "Пароль не может быть короче 8 сисволов!")
            .required("Это обязатльное поле!"),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Пароль не совпадает")
            .required("Это обязатльное поле!"),
        })}
        onSubmit={(values) => {
          console.log({
            name: values.name,
            phoneNumber: values.phoneNumber.replace(/[^\d]/g, ""),
            password: values.password,
            confirmPassword: values.confirmPassword,
          });

          axios
            .post(
              `http://localhost:5136/User/RegisterNewUser?name=${
                values.name
              }&phoneNumber=${values.phoneNumber.replace(
                /[^\d]/g,
                ""
              )}&password=${values.password}`
              // {
              //   params: {
              //     phoneNumber: values.phoneNumber.replace(/[^\d]/g, ""),
              //     name: values.name,
              //     password: values.password,
              //   },
              // }
            )
            .then((response) => {
              if (response.data == "Вы успешно зарегистрировались") {
                setSuccsessAlert(true);
                dispatch(setIsLoged(true));
                navigate("/dashboard");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="name">Имя</label>
              <Field
                name="name"
                type="text"
                className={
                  "form-control" +
                  (errors.name && touched.name ? " is-invalid" : "")
                }
              />
              <ErrorMessage
                name="name"
                component="div"
                className="invalid-feedback"
              />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Номер телефона</label>
              <InputMask
                mask="+7 (999) 999-99-99"
                maskChar=" "
                value={values.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                name="phoneNumber"
                type="tel"
                className={
                  "form-control" +
                  (errors.phoneNumber && touched.phoneNumber
                    ? " is-invalid"
                    : "")
                }
              />
              <ErrorMessage
                name="phoneNumber"
                component="div"
                className="invalid-feedback"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <Field
                name="password"
                type="password"
                className={
                  "form-control" +
                  (errors.password && touched.password ? " is-invalid" : "")
                }
              />
              <ErrorMessage
                name="password"
                component="div"
                className="invalid-feedback"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Подтвердите пароль</label>
              <Field
                name="confirmPassword"
                type="password"
                className={
                  "form-control" +
                  (errors.confirmPassword && touched.confirmPassword
                    ? " is-invalid"
                    : "")
                }
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="invalid-feedback"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Регистрация
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Registration;
