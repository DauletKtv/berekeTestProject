import React from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AddHareToUser = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [btnText, setBtnText] = useState("Назначить");
  const [formInfo, setFormInfo] = useState({ name: "", id: "" });
  const switchTab = (bool) => {
    setIsLogin(bool);
  };
  const addHareForUser = async () => {
    if (formInfo.name == "" && formInfo.id == "") {
      toast.error("Заполните все поля!");
      return;
    }
    if (isLogin) {
      try {
        const response = await axios.post(
          `http://localhost:5136/Request/AddRequestToUser?ID=${formInfo.id}&Name=${formInfo.name}`
        );
        setFormInfo({ name: "", id: "" });
        toast.success("Вы успешно назначили заявку!");
      } catch (error) {
        toast.error("Данного пользователя нет!");
        console.error(error);
      }
    } else {
      try {
        const response = await axios.post(
          `http://localhost:5136/Request/RemoveRequestFromUser?ID=${formInfo.id}&Name=${formInfo.name}`
        );
        setFormInfo({ name: "", id: "" });
        toast.success("Вы успешно сняли заявку!");
      } catch (error) {
        toast.error("Данного пользователя не существует!");
        console.error(error);
      }
    }
  };
  return (
    <div className="AddHareToUser">
      <div className="AddHareToUserContent">
        <div className="AddHareToUserBtnsControler">
          <button
            className={isLogin ? "activeBtn" : ""}
            onClick={() => switchTab(true)}
          >
            Назначить заявку
          </button>
          <button
            className={isLogin ? "" : "activeBtn "}
            onClick={() => switchTab(false)}
          >
            Снять заяку
          </button>
        </div>
        <form
          action=""
          className="AddHareToUserForm"
          onSubmit={(e) => {
            e.preventDefault();
            addHareForUser();
          }}
        >
          <input
            type="text"
            placeholder="Имя"
            value={formInfo.name}
            className="form-control"
            onChange={(e) => setFormInfo({ ...formInfo, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Номер заявки"
            className="form-control"
            value={formInfo.id}
            onChange={(e) => setFormInfo({ ...formInfo, id: e.target.value })}
          />
          <button type="submit" className="btn btn-primary registerBtn">
            {isLogin ? "Назначить" : "Снять заяку"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddHareToUser;
