import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAlert } from "react-alert";
import { Link } from "react-router-dom";

export default function MyGroups() {
  const alert = useAlert();
  const [gList, setGlist] = useState([]);
  const [grps, setGrps] = useState([]);
  const [invites, setInvites] = useState([]);
  const [invGrps, setInvGrps] = useState([]);

  useEffect(() => {
    axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
    axios.defaults.withCredentials = true;
    axios
      .get("/users/getGroups")
      .then((res) => {
        res.data.groups.forEach((group) => {
          axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
          axios.defaults.withCredentials = true;
          axios.get(`/groups/${group._id}`).then((res) => {
            setGlist((ps) => [...ps, res.data.group]);
            setGrps((ps) => [...ps, res.data.group]);
          });
        });
      })
      .catch((err) => {
        alert.error(String(err));
      });

    axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
    axios.defaults.withCredentials = true;
    axios
      .get("/groups/getInvites")
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
      .catch();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const newList = gList.filter((g) => g.name.includes(e.target.value));
    setGrps([...newList]);
  };

  const handleLeaveGroup = (id) => {
    axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
    axios.defaults.withCredentials = true;
    axios
      .post("/groups/leave", { groupId: id })
      .then((res) => {
        setGlist((ps) => []);
        setGrps((ps) => []);
        axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
        axios.defaults.withCredentials = true;
        axios
          .get("/users/getGroups")
          .then((res) => {
            res.data.groups.forEach((group) => {
              axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
              axios.defaults.withCredentials = true;
              axios.get(`/groups/${group._id}`).then((res) => {
                setGlist((ps) => [...ps, res.data.group]);
                setGrps((ps) => [...ps, res.data.group]);
              });
            });
          })
          .catch((err) => { });
        alert.success("Group left");
      })
      .catch((err) => {
        alert.error(err.response?.data?.errors[0]);
      });
  };

  const handleAccept = (gid) => {
    const inv = invites.filter((group) => group._id === gid);
    axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
    axios.defaults.withCredentials = true;
    axios
      .post("/groups/acceptInvite", { inviteId: inv[0]._id })
      .then((res) => {
        setInvGrps([]);
        setGrps([]);
        alert.success("Invitation Accepted");
        axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
        axios.defaults.withCredentials = true;
        axios
          .get("/users/getGroups")
          .then((res) => {
            res.data.groups.forEach((group) => {
              axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
              axios.defaults.withCredentials = true;
              axios.get(`/groups/${group._id}`).then((res) => {
                setGlist((ps) => [...ps, res.data.group]);
                setGrps((ps) => [...ps, res.data.group]);
              });
            });
          })
          .catch((err) => { });

        axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
        axios.defaults.withCredentials = true;
        axios
          .get("/groups/getInvites")
          .then((res) => {
            setInvites(res.data.invites);
            res.data.invites.forEach((invite) => {
              axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
              axios.defaults.withCredentials = true;          
              axios.get(`/groups/${invite._id}`).then((res) => {
                setInvGrps((ps) => [...ps, res.data.group]);
              });
            });
          })
          .catch((err) => {
            if (err.response?.data.errors) {
              err.response?.data.errors.map((e) => alert.error("Error: " + e));
            } else {
              alert.error("getInvites: Something went wrong");
            }
          });
      })
      .catch((err) => {
        if (err.response?.data.errors) {
          err.response?.data.errors.map((e) => {
            alert.error(e)
          });
        } else {
          alert.error(err.response?.data.msg);
        }
      });
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 border-right" >
          <div className="row" >
            <div className="col" style={{ marginLeft: "auto", marginRight: 0 }}>
              <h3 style={{ marginLeft: 50 }}>Pending Invites</h3>
              <ul style={{ marginLeft: "10%", marginTop: "20px" }}>
                {invGrps.map((g) => {
                  return (
                    <li style={{ fontSize: 24 }} key={g._id} className="mb-4">
                      {g.name}{" "}
                      <button className="btn btn-success ml-2 mt-n2"
                        className="btn btn-success"
                        onClick={() => handleAccept(g._id)}
                      >
                        Accept
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="row" >
            <div className="col" style={{ marginRight: "auto", marginLeft: 0 }}>
              <h3 style={{ marginLeft: 250 }}>My groups</h3>
              <div className="form-group" style={{ marginLeft: "auto", marginRight: 0 }}>
                <input style={{ width: "50%", marginLeft: "35%", marginTop: "20px" }}
                  onChange={handleSearch}
                  className="form-control"
                  type="text"
                  name="search"
                  required
                  placeholder="Search By Group Name"
                />
              </div>
              <ul style={{ marginLeft: "35%", marginTop: "20px" }}>
                {grps.map((g) => {
                  return (
                    <li key={g._id} className="mb-4">
                      <Link style={{ fontSize: 24 }} to={`/groups/${g._id}`}>{g.name}</Link>
                      <button
                        className="btn btn-danger ml-2 mt-n2"
                        onClick={() => handleLeaveGroup(g._id)}
                      >
                        Leave Group
                  </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
