import axios from "axios";
import React, { useState, useEffect } from "react";
import { useAlert } from "react-alert";

export default function CreateInvite() {
  const [emails, setEmails] = useState([]);
  const [gName, setGName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const alert = useAlert();
  const inputGroupName = React.useRef();
  const inputEmail = React.useRef();

  useEffect(() => {
    axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
    axios.defaults.withCredentials = true;
    axios
      .get("/users/getAllEmailsExceptCurrent")
      .then((res) => {
        setEmails(res.data.emails);
      })
      .catch((err) => {
        alert.error(String(err));
      });
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    const newSuggstn = emails.filter((email) => email.match(e.target.value));
    if (!e.target.value) {
      setSuggestions([]);
      return;
    }
    setSuggestions(newSuggstn);
  };

  const handleInvite = (email) => {
    if (!gName) {
      alert.info("Please enter Group Name first");
      return;
    }
    axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
    axios.defaults.withCredentials = true;
    axios
      .post("/groups/invite", { name: gName, email })
      .then((res) => {
        alert.success(res.data.msg);
        inputEmail.current.value = "";
        setSuggestions([]);
      })
      .catch((err) => {
        if (err.response?.data.errors) {
          err.response?.data.errors.map((e) => alert.error(e));
        } else {
          alert.error(err.response?.data.msg);
        }
      });
  };

  return (
    <div >
      <h3 className="section-heading">GROUP MEMBERS</h3>
      <div className="row my-2">
        <div className="col-md-6">
          <h5>Enter Group Name</h5>
        </div>
        <div className="col-md-5">
          <form>
            <input 
              type="search" ref={inputGroupName}
              className="form-control"
              onChange={(e) => setGName(e.target.value)}
            />
          </form>
        </div>
        <div className="col-md-3"></div>
      </div>
      <div className="row mt-2">
        <div className="col-md-6">
          <h5>Enter member email to invite</h5>
        </div>
        <div className="col-md-5">
          <form>
            <input ref={inputEmail}
              type="search"
              className="form-control"
              onChange={handleChange} />
          </form>
        </div>

      </div>
      <div className="row mt-4">
        <div className="col-md-6"></div>
        <ul className="center">
          {suggestions.map((s) => (
            <li key={s} className="mb-3 text-left">
              {s}{" "}
              <button
                className="btn btn-success"
                onClick={() => handleInvite(s)}>
                Invite
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
