import "./Dashboard.css";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useAlert } from "react-alert";

import { useSelector, useDispatch } from "react-redux";
import { getStats, getDashboardData, getTUsers, settle, res } from '../../Actions/DashboardActions';
import { resetMsg } from '../../reducer/DashboardReducer';

Modal.setAppElement("#root");

export default function Dashboard() {
  const dispatch = useDispatch();
  const redux_data = useSelector(state => state.dashboard);

  const alert = useAlert();

  const [borrowerId, setBorrowerId] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [owe, setOwe] = useState([]);
  const [pay, setPay] = useState([]);
  const [sUsers, setSUsers] = useState(new Map());
  const [data, setData] = useState({
    totalBorrowed: 0,
    totalOwened: 0,
    authored: [],
    borrowed: [],
  });
  const customStyles = {
    content: {
      top: "40%",
      left: "50%",
      right: "50%",
      bottom: "auto",
      marginRight: "-40%",
      transform: "translate(-40%, -40%)",
    },
  };

  const fetchRes = () => {
    setData([]);
    axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
    axios.defaults.withCredentials = true;
    dispatch(getStats());
    // setData(redux_data.data);
    // axios
    //   .get(`/groups/getStats`)
    //   .then((res) => {
    //     setData(res.data);
    //   })
    //   .catch((err) => {
    //     alert.error(String(err)); //err.response?.data?.msg
    //   });

    setSUsers(new Map());

    axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
    axios.defaults.withCredentials = true;
    dispatch(getDashboardData());
    // setPay([]);
    // setOwe([]);
    // redux_data.finalDashboardData.map((e) => {
    //   if (e.includes("owe")) {
    //     setOwe((ps) => [...ps, e]);
    //   }
    //   else {
    //     setPay((ps) => [...ps, e]);
    //   }
    // })

    // axios
    //   .get(`/groups/getDashboardData`)
    //   .then((res) => {
    //     setPay([]);
    //     setOwe([]);
    //     res.data.finalDashboardData.map((e) => {
    //       if (e.includes("owe")) {
    //         setOwe((ps) => [...ps, e]);
    //       }
    //       else {
    //         setPay((ps) => [...ps, e]);
    //       }
    //     })
    //   })
    //   .catch(console.log);

    axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
    axios.defaults.withCredentials = true;
    dispatch(getTUsers());
    // axios
    //   .get(`/groups/getTusers`)
    //   .then((res) => {
    //     let usersId = new Map();
    //     setSUsers(res.data.users);
    //   })
    //   .catch(console.log);
  };

  useEffect(() => {
    dispatch(resetMsg());
    fetchRes();
  }, []);

  useEffect(() => {
    setData(redux_data.data);
  }, [redux_data.data])

  useEffect(() => {
    setPay([]);
    setOwe([]);
    redux_data.finalDashboardData.map((e) => {
      if (e.includes("owe")) {
        setOwe((ps) => [...ps, e]);
      }
      else {
        setPay((ps) => [...ps, e]);
      }
    })
  }, [redux_data.finalDashboardData])

  useEffect(() => {
    let usersId = new Map();
    setSUsers(redux_data.users);
  }, [redux_data.users])

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() { }

  function closeModal() {
    setIsOpen(false);
  }

  const handleSettle = (e) => {
    e.preventDefault();
    if (borrowerId === "none") {
      alert("Please select a user first");
      return;
    }
    if (!borrowerId) {
      alert("Please select a user to settle with");
      return;
    }
    dispatch(settle(borrowerId));
    fetchRes();
    closeModal();
    dispatch(resetMsg());
    // axios
    //   .post("/users/settle", { borrowerId })
    //   .then((res) => {
    //     fetchRes();
    //     closeModal();
    //   })
    //   .catch((err) => { });
  };

  useEffect(() => {
    if (redux_data.msg !== "") {
      if (redux_data.success)
        alert.success(redux_data.msg);
      else
        alert.error(redux_data.msg);
    }
  }, [redux_data.msg])

  return (
    <nav>
      <nav className="main">
        <Sidebar />
        <nav className="main-nav">
          <nav className="dashheader">
            <nav className="dashtop">
              <h2 className="dashboardtitle" style={{ fontWeight: "bold" }}>Dashboard</h2>
              <div className="dashbuttons">
                <button className="add-bill-button">Add A Bill</button>
                <button className="dash-button" onClick={openModal}>
                  Settle Up
                </button>
                <Modal
                  isOpen={modalIsOpen}
                  onAfterOpen={afterOpenModal}
                  onRequestClose={closeModal}
                  contentLabel="Add Expense"
                  style={customStyles}
                >
                  <h2 className="settle-form">Settle Up!</h2>
                  <hr />
                  <form onSubmit={handleSettle}>
                    <section className="container">
                      <div className="left">
                        Choose friend to settle up with:
                      </div>
                      <div>
                        <select
                          className="right"
                          name="borrowerId"
                          onChange={(e) => {
                            setBorrowerId(e.target.value);
                          }}
                        >
                          <option value="none" key="none">
                            Select
                          </option>
                          {Array.from(sUsers).map((user) => {

                            return (
                              <option value={user._id} key={user._id}>
                                {user.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </section>
                    <div className="buttons">
                      <button onClick={closeModal} className="cancelbutton">
                        Cancel
                      </button>
                      <input
                        type="submit"
                        value="Save"
                        className="savebutton"
                      />
                    </div>
                  </form>
                </Modal>
              </div>
            </nav>
          </nav>
          <div className="row mt-2 pl-2">
            <div className="col-6 border-right">
              <p style={{ fontSize: 18, fontWeight: "bold", paddingLeft: 80, color: "darkgray" }}>You owe</p>
              <hr />
              {owe &&
                owe.map((ele, i) => (
                  <p className="text-danger" key={i}>
                    {/* You owe {ele.amount} to {ele.authorName} */}
                    {ele}
                  </p>
                ))}
            </div>
            <div className="col-6">
              <p style={{ fontSize: 18, fontWeight: "bold", paddingLeft: 50, color: "darkgray" }}>You are owed</p>
              <hr />
              {pay &&
                pay.map((ele, i) => (
                  <p className="text-success" key={i}>
                    {/* {ele.borrowerName} owes you {ele.amount} */}
                    {ele}
                  </p>
                ))}
            </div>
          </div>
        </nav>
      </nav>
    </nav>
  );
}
