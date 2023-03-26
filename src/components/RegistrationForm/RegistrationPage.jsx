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
    <div>
      <div>
        <button
          className={isLogin ? "activeBtn" : ""}
          onClick={() => switchTab(true)}
        >
          Вход
        </button>
        <button
          className={isLogin ? "" : "activeBtn"}
          onClick={() => switchTab(false)}
        >
          Регистрация
        </button>
      </div>
      {isLogin ? <Login /> : <Registration />}
    </div>
  );
};

export default RegistrationPage;
