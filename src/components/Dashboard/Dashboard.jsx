import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import { setIsLoged } from "../../redux/loginSlice";
const Dashboard = () => {
  function phone_mask_cl(e) {
    let val = e;
    if (val.length >= 1) {
      val = "+" + val.replace(/[^\d]/g, "");
    }
    if (val.length > 2) {
      val = val.substr(0, 2) + "(" + val.substr(2, val.length);
    }
    if (val.length > 6) {
      val = val.substr(0, 6) + ")" + val.substr(6, val.length);
    }
    if (val.length > 10) {
      val = val.substr(0, 10) + "-" + val.substr(10, val.length);
    }
    if (val.length > 13) {
      val = val.substr(0, 13) + "-" + val.substr(13, val.length);
    }
    val = val.substr(0, 16);
    return val;
  }
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [userNameHare, setUserNameHare] = useState("");
  const [reFetch, setReFetch] = useState(true);
  const logState = useSelector((state) => state.log);
  const dispatch = useDispatch();
  const [rows, setRows] = useState([]);
  const [isItEmptyText, setIsItEmptyText] = useState("Ничего не найдено");
  const [addNewHare, setAddNewHare] = useState({
    phoneNumber: "",
    fio: "",
    email: "",
    type: 0,
  });
  const [clickedId, setClickedId] = useState("");
  const addRequestForUser = async (e) => {
    e.preventDefault();
    if (userNameHare == "") {
      toast.error("Заполните все поля!");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5136/Request/AddRequestToUser?ID=${clickedId}&Name=${userNameHare}`
      );
      setAddNewHare({
        phoneNumber: "",
        fio: "",
        email: "",
        type: 0,
      });
      document.querySelector("#addHareForEmployee .modal-header span").click();
    } catch (error) {
      toast.error("Данного пользователя нет!");
      console.error(error);
    }
  };
  const removeRequestForUser = async (e) => {
    e.preventDefault();
    if (userNameHare == "") {
      toast.error("Заполните все поля!");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5136/Request/RemoveRequestFromUser?ID=${clickedId}&Name=${userNameHare}`
      );
      document.querySelector("#addHareForEmployee .modal-header span").click();
    } catch (error) {
      toast.error("Данного пользователя не существует!");
      console.error(error);
    }
  };
  const sendNewHare = async (e) => {
    e.preventDefault();
    if (
      addNewHare.phoneNumber !== "" &&
      addNewHare.fio !== "" &&
      addNewHare.email !== "" &&
      addNewHare.type !== ""
    ) {
      try {
        const response = await axios.post(
          `http://localhost:5136/Request/AddRequest?phoneNumber=${addNewHare.phoneNumber}&fio=${addNewHare.fio}&email=${addNewHare.email}&type=${addNewHare.type}`
        );
        setRows(response.data);
        setReFetch(!reFetch);
        setAddNewHare({
          phoneNumber: "",
          fio: "",
          email: "",
          type: 0,
        });
        document.querySelector(".modal-header span").click();
      } catch (error) {
        console.error(error);
        toast.error("Что то пошло не так!");
      }
    } else {
      toast.error("Заполните все поля!");
    }
  };
  const fetchData = async () => {
    try {
      if (searchValue == "") {
        const response = await axios.get(
          "http://localhost:5136/Request/GetAllRequests"
        );
        setRows(response.data);
      } else {
        const response = await axios.get(
          `http://localhost:5136/Request/GetRequest?Id=${searchValue}`
        );
        if (response.data == "") {
          setRows([]);
          toast.error("Ничего не найдено", {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 3000,
          });
        } else {
          setRows([response.data]);
        }

        console.log(response);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleStatusChange = async (id, newStatus) => {
    if (newStatus == 1) {
      try {
        const response = await axios.post(
          `http://localhost:5136/Request/CancelRequest?id=${id}`
        );
        setReFetch(!reFetch);
      } catch (error) {
        console.error(error);
      }
    } else if (newStatus == 2) {
      try {
        const response = await axios.post(
          `http://localhost:5136/Request/CloseRequest?id=${id}`
        );
        setReFetch(!reFetch);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const response = await axios.post(
          `http://localhost:5136/Request/RemoveRequest?id=${id}`
        );
        setReFetch(!reFetch);
      } catch (error) {
        console.error(error);
      }
    }
  };
  useEffect(() => {
    if (localStorage.getItem("isLoged") !== "true") {
      navigate("/");
    }

    fetchData();
  }, [reFetch]);
  const hareType = (hare) => {
    let text = "";
    switch (hare) {
      case 0:
        text = "Продажа";
        break;
      case 1:
        text = "Покупка";
        break;
      case 2:
        text = "Аукцион";
        break;
    }
    return text;
  };
  function handleChange(event) {
    const { name, value } = event.target;
    setAddNewHare({ ...addNewHare, [name]: value });
  }
  return (
    <div className="DashboardBlock">
      <div className="contentAllHare">
        <header>
          <nav className="navbar navbar-light bg-light searchNavBer">
            <form
              className="form-inline"
              onSubmit={(e) => {
                e.preventDefault();
                setReFetch(!reFetch);
              }}
            >
              <input
                className="form-control mr-sm-2"
                type="search"
                placeholder="Поиск"
                aria-label="Search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button
                className="btn btn-outline-success my-2 my-sm-0"
                type="submit"
              >
                Поиск
              </button>
            </form>
            <button
              type="button"
              className="btn btn-outline-success my-2 my-sm-0"
              data-toggle="modal"
              data-target="#exampleModalCenter"
              onClick={() => {
                setAddNewHare({
                  phoneNumber: "",
                  fio: "",
                  email: "",
                  type: 0,
                });
              }}
            >
              Добавить
            </button>
          </nav>
        </header>
        <div className="table-holder">
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">№</th>
                <th scope="col">ФИО</th>
                <th scope="col">Почта</th>
                <th scope="col">Телефон</th>
                <th scope="col">Тип</th>
                <th scope="col">Статус</th>
              </tr>
            </thead>

            {rows?.length > 0 ? (
              <tbody>
                {" "}
                {rows?.map((row) => (
                  <tr key={row.id}>
                    <td
                      scope="row"
                      onClick={() => {
                        setClickedId(row.id);
                        setUserNameHare("");
                      }}
                      className="row-id-tr clickTd"
                      data-toggle="modal"
                      data-target="#addHareForEmployee"
                    >
                      {row.id}
                    </td>
                    <td>{row.fio}</td>
                    <td>{row.email}</td>
                    <td>+{row.phoneNumber}</td>
                    <td>{hareType(row.type)}</td>
                    <td>
                      <div className="dropdown">
                        <button
                          className="btn btn-secondary dropdown-toggle selectStatus"
                          type="button"
                          id={`dropdown-${row.id}`}
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          {row.status == 2 ? "Отменен" : "Закрыт"}
                        </button>
                        <div
                          className="dropdown-menu"
                          aria-labelledby={`dropdown-${row.id}`}
                        >
                          <button
                            className="dropdown-item"
                            onClick={() => handleStatusChange(row.id, 2)}
                          >
                            Закрыть
                          </button>
                          <button
                            className="dropdown-item"
                            onClick={() => handleStatusChange(row.id, 1)}
                          >
                            Отменить
                          </button>
                          <button
                            className="dropdown-item"
                            onClick={() => handleStatusChange(row.id, 0)}
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : null}
          </table>
        </div>

        {rows.length < 1 ? (
          <div className="emptyText">
            <h1>{isItEmptyText}</h1>
          </div>
        ) : null}
        <div
          className="modal fade add-modal"
          id="exampleModalCenter"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">
                  Создать новую заявку
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form action="#" onSubmit={sendNewHare}>
                  <div class="mb-3">
                    <label for="phoneNumber" class="form-label">
                      Номер телефона
                    </label>
                    <input
                      name="phoneNumber"
                      type="text"
                      class="form-control"
                      value={phone_mask_cl(addNewHare.phoneNumber)}
                      onChange={handleChange}
                    />
                  </div>
                  <div class="mb-3">
                    <label for="fio" class="form-label">
                      ФИО
                    </label>
                    <input
                      name="fio"
                      type="text"
                      class="form-control "
                      value={addNewHare.fio}
                      onChange={handleChange}
                    />
                  </div>
                  <div class="mb-3">
                    <label for="email" class="form-label">
                      Почта
                    </label>
                    <input
                      name="email"
                      type="email"
                      class="form-control "
                      value={addNewHare.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div class="mb-3">
                    <label for="type" class="form-label">
                      Тип заявки
                    </label>
                    <select
                      name="type"
                      id=""
                      value={addNewHare.type}
                      onChange={handleChange}
                    >
                      <option
                        value="0"
                        onClick={(e) => {
                          setAddNewHare({ ...addNewHare, type: 0 });
                        }}
                      >
                        Продажа
                      </option>
                      <option
                        value="1"
                        onClick={(e) => {
                          setAddNewHare({ ...addNewHare, type: 1 });
                        }}
                      >
                        Покупка
                      </option>
                      <option
                        value="2"
                        onClick={(e) => {
                          setAddNewHare({ ...addNewHare, type: 2 });
                        }}
                      >
                        Аукцион
                      </option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <button type="submit" class="btn btn-primary">
                      Создать
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div
          class="modal fade"
          id="addHareForEmployee"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">
                  Заявка №{clickedId}
                </h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <div class="mb-3">
                  <label for="userName" class="form-label">
                    Имя пользователя
                  </label>
                  <input
                    name="userName"
                    type="text"
                    class="form-control"
                    value={userNameHare}
                    onChange={(e) => setUserNameHare(e.target.value)}
                  />
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-primary"
                  data-dismiss="modal"
                  onClick={addRequestForUser}
                >
                  Присвоить заяку
                </button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  onClick={removeRequestForUser}
                >
                  Убрать заявку
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
