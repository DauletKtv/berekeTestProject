import React from "react";
import Login from "./Login";
import Registration from "./REgistration";
import { useState } from "react";
const RegistrationPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const switchTab = (bool) => {
    setIsLogin(bool);
  };
  return (
    <div className="RegistrationPage">
      <h1 className="RegistrationPage-titel">TestTaskDotnet</h1>
      <div className="RegistrationPage-block">
        <div className="RegistrationPage-btn-controlers">
          <button
            className={isLogin ? "activeBtn" : ""}
            onClick={() => switchTab(true)}
          >
            Вход
          </button>
          <button
            className={isLogin ? "" : "activeBtn "}
            onClick={() => switchTab(false)}
          >
            Регистрация
          </button>
        </div>

        {isLogin ? <Login /> : <Registration switchTab={switchTab} />}
      </div>
    </div>
  );
};

export default RegistrationPage;
