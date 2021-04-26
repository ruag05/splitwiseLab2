import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import "./Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressBook, faUsers, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faFlag } from "@fortawesome/free-solid-svg-icons";

const LeftNav = () => {
  let friends = ["Naren", "Apoorv", "Manovikas", "Prachal"];

  const [grps, setGrps] = useState([]);
  const [invs, setInvites] = useState([]);
  const [invGrps, setInvGrps] = useState([]);
  useEffect(() => {
    axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
    axios.defaults.withCredentials = true;
    axios
      .get("/users/getGroups")
      .then((res) => {
        res.data.groups.forEach(group => {
          setGrps((ps) => [...ps, group]);
        });
      })
      .catch((err) => { });

      axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
      axios.defaults.withCredentials = true;  
    axios.get("/groups/getInvites")
      .then((res) => {
        setInvites(res.data.invites);
        res.data.invites.forEach((invite) => {
          axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
          axios.defaults.withCredentials = true;
      
          axios.get(`/groups/${invite._id}`).then((res) => {
            setInvGrps((ps) => [...ps, invite]);
          });
        });
      })
  }, []);
  return (
    <nav className="left-nav">
      <NavLink to="/dashboard" className="dashlink" activeClassName="is-active">
        <div className="logoimg2"></div>Dashboard
      </NavLink>
      <NavLink to="/activity" className="dashlink" activeClassName="is-active">
        {" "}
        <span className="mx-2">
          <FontAwesomeIcon icon={faFlag} color="grey" />
        </span>
        Recent Activity
      </NavLink>
      <h1 className="headers">Groups<button className="add-button"></button>
      </h1>
      {grps.map((g) => (
        <p key={g._id} className="each-group">
          <Link className="each-element" to={`/groups/${g._id}`}>
            <span className="mx-2" style={{marginLeft: "5%"}}>
              <FontAwesomeIcon icon={faUsers} color="grey" />
            </span>
            {g.name}
          </Link>
        </p>
      ))}
      <h1 className="headers">Invites Requests<button className="add-button"></button>
      </h1>
      {invGrps.map(g => (
        <p key={g._id} className="each-friend">
          <Link className="each-element" to={`/groups`}>
            <span classname="mx-9" style={{ marginRight: "5%" }}>
              <FontAwesomeIcon icon={faUserPlus} color="grey" />
            </span>
            {g.name}
          </Link>
        </p>
      ))}
      <h1 className="headers">Friends<button className="add-button"></button>
      </h1>
      {friends.map((friend) => (
        <p className="each-friend">
          <span className="mx-2">
            <FontAwesomeIcon icon={faAddressBook} color="grey" />
          </span>
          {friend}
        </p>
      ))}
      <nav className="invitenav">
        <h1 className="invitefriends">Invite Friends to Splitwise</h1>
        <input
          type="text"
          className="emailadd"
          placeholder="Enter an email address"
        />
        <input className="submitemail" type="submit" value="Send invite" />
      </nav>
      <br />
      <div className="buttonflex">
        <a
          href="https://www.linkedin.com/in/ruchir-agarwal-7b2713a7/"
          target="_blank"
          rel="noreferrer"
          className="linkedin"
        >
          Linked <i className="fab fa-linkedin"></i>
        </a>
        <a
          href="https://github.com/ruchiragarwal/"
          target="_blank"
          rel="noreferrer"
          className="linkedin github"
        >
          Github <i className="fab fa-github"></i>
        </a>
      </div>
    </nav>
  );
};

export default LeftNav;
