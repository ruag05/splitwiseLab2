import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import Modal from "react-modal";
import "./GroupInfo.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import AddComment from './AddComment';
import { useAlert } from "react-alert";

Modal.setAppElement("#root");

export default function GroupInfo() {
  const alert = useAlert();

  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [data, setData] = useState({ title: "", amount: 0 });
  const [trans, setTrans] = useState([]);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState([]);
  const [gName, setGName] = useState(new Map());
  const [selected, setSelected] = useState(null);

  const toggleExpense = (i, tId) => {
    if (selected === i) {
      return setSelected(null);
    }
    setSelected(i);   
  }
  const customStyles = {
    content: {
      top: "40%",
      left: "50%",
      right: "60%",
      bottom: "auto",
      marginRight: "-40%",
      transform: "translate(-40%, -40%)",
    },
  };

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() { }

  function closeModal() {
    setIsOpen(false);
  }

  const { gid } = useParams();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
    axios.defaults.withCredentials = true;
    axios
      .post("/groups/addExpense", { ...data, gid })
      .then(() => {
        closeModal();
        setData({ title: "", amount: 0 });
        fetchTransactions();
        alert.success("Expense Added");
      })
      .catch(console.log);
  };

  function fetchTransactions() {
    axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
    axios.defaults.withCredentials = true;
    axios
      .get(`/groups/getTransactions/${gid}`)
      .then((res) => {
        setTrans(res.data.trans);
        setHistory(res.data.history);
        setStats(res.data.groupBalances);
      })
      .catch((err) => {
        alert.error(String(err));
      });
    axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
    axios.defaults.withCredentials = true;
    axios
      .get(`/groups/${gid}`)
      .then((res) => {
        let name = res.data.group.name;
        setGName(name);
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  function formatNumber(int) {
    return int.toFixed(2);
  }

  function formatDate(d) {
    return ("0" + d.getDate()).slice(-2)
  }

  return (
    <div>
      <div className="row" style={{ height: 40 }}>
        <button className="btn btn-lightslategray" style={{ backgroundColor: "lightslategray", color: "white", alignContent: "center", marginTop: 20, marginLeft: "15%", height: 40 }}
          onClick={openModal}>
          Add Expense
        </button>
      </div>
      <br></br>
      <hr></hr>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Add Expense"
        style={customStyles}>
        <h2 className="add-a-bill">Add New Expense</h2>
        <hr />
        <form onSubmit={handleAddExpense}>
          <span>
            <h3 className="addfriendslabel">With
        "<p style={{ fontSize: 22, color: "gray" }}>You" </p>
        and Group "<p style={{ fontSize: 22, color: "Gray" }}>{gName}"</p></h3>
          </span>
          <span className="leftinput">
            <input
              className="descrp"
              type="text"
              name="title"
              placeholder="Enter a description"
              required
              value={data.title}
              onChange={handleChange}
            />
            <div className="amount">
              <div className="dollar">$</div>
              <input
                className="amtinput"
                type="number"
                min="1"
                name="amount"
                required
                step="0.01"
                value={data.amount}
                placeholder="0.00"
                onChange={handleChange}
              />
            </div>
          </span>
          <br />
          <div className="buttons">
            <button onClick={closeModal} className="cancelbutton">
              Cancel
            </button>
            <input type="submit" value="Save" className="savebutton" />
          </div>
        </form>
      </Modal>
      <div className="container" style={{ marginTop: 20, }}>
        <div className="row">
          <div className="col-8">
            <h4 className="ml-5">Group History</h4>
            <div >
              <ul style={{ listStyle: "none", marginTop: "20px" }}>
                {history.map((t, i) => {
                  const d = new Date(t.createdAt);
                  return (
                    <div className="wrapper">
                      <div className="accordion">
                        <p>
                          <li
                            key={t.id}>
                            <div className="item">
                              <div className="title" onClick={() => toggleExpense(i, t._id)}>
                                <div className="row rounded" style={{ padding: "2%", backgroundColor: '#808080', color: "white" }}>
                                  <div className="leftcolumn1" style={{ width: "6%" }}>
                                    <span style={{ fontWeight: 450 }}>{d.toLocaleString('default', { month: 'short' }).toUpperCase()}</span> <br />
                                    <span style={{ fontWeight: 800, marginLeft: "10%" }}>{formatDate(d)}</span> <br />
                                  </div>
                                  <div className="leftcolumn2" style={{ width: "7%" }}>
                                    <FontAwesomeIcon icon={faClipboardList} size="3x" color="ivory" style={{ marginTop: "2%", height: 40 }} />
                                  </div>
                                  <div className="rightcolumn">
                                    <span className="centered">{t.title}</span> <br />
                                  </div>
                                  <div style={{ fontSize: 20, marginLeft: "auto" }}>{selected === i ? '-' : '+'}</div>
                                </div>
                              </div>
                              <div className="content" style={{ backgroundColor: "#A8A8A8" }} className={selected === i ? 'content.show' : 'content'}>
                                <p style={{ paddingLeft: "1%", color: "white" }}>
                                  <AddComment expId={t._id} />
                                </p>
                              </div>
                            </div>
                          </li>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </ul>
            </div>
            {trans.length < 1 ? <p>No Transactions yet</p> : null}
          </div>
          <div className="col-4">
            <h4 className="ml-1">Group balance</h4>
            <div>
              {stats.map((st) => {
                return (
                  <p style={{ backgroundColor: "#A0A0A0", color: "white", marginTop: 20, width: "80%" }} className="p-2 text-white rounded">{st}</p>
                );
              })}
              {stats.length < 1 ? "Nothing to show" : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}