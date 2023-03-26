import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import RegistrationPage from "./components/RegistrationForm/RegistrationPage";
import Dashboard from "./components/Dashboard/Dashboard";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddHareToUser from "./components/AddHareToUser/AddHareToUser";
import { useSelector, useDispatch } from "react-redux";
import { setIsLoged } from "./redux/loginSlice";
import { useNavigate } from "react-router-dom";
import { Link, NavLink, redirect } from "react-router-dom";
function App() {
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className={localStorage.getItem("isLoged") !== "true" ? "App" : ""}>
      <ToastContainer />
      {localStorage.getItem("isLoged") !== "true" ? null : (
        <div className="sidebar">
          <h4>TestTaskDotnet</h4>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "links activeLink" : "links"
            }
          >
            <div className="flex z-10">
              <div className="app__title">Завки</div>
            </div>
          </NavLink>
          <NavLink
            to="/AddHareToUser"
            className={({ isActive }) =>
              isActive ? "links activeLink" : "links"
            }
          >
            <div className="flex z-10">
              <div className="app__title">Мои заявки</div>
            </div>
          </NavLink>
          <button
            className="exitBtn"
            onClick={() => {
              dispatch(setIsLoged(false));
              navigate("/");
            }}
          >
            Выйти
          </button>
        </div>
      )}

      <Routes>
        <Route path="/" element={<RegistrationPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/AddHareToUser" element={<AddHareToUser />} />
      </Routes>
    </div>
  );
}

export default App;
