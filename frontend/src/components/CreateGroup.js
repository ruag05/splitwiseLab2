import axios from "axios";
import React, { useState, useEffect } from "react";
import { useAlert } from "react-alert";
import CreateInvite from "./CreateInvite";
import splitwiselogo from "../images/splitwise-logo.png"

import { useSelector, useDispatch } from "react-redux";
import { createGroup } from '../Actions/CreateGroupActions';
import { resetMsg } from '../reducer/CreateGroupReducer';

export default function CreateGroup() {

  const dispatch = useDispatch();
  const redux_data = useSelector(state => state.createGroup);

  const alert = useAlert();

  const [state, setState] = useState({ name: "", photo: null });

  const inputGroupName = React.useRef();
  const inputPhoto = React.useRef();

  const handleCreateGroup = (e) => {
    e.preventDefault();
    let data = new FormData();
    for (let [key, value] of Object.entries(state)) {
      data.append(key, value);
    }
    axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
    axios.defaults.withCredentials = true;
    dispatch(createGroup(data));
  };

  useEffect(() => {
    if (redux_data.msg !== "")
      alert.success(redux_data.msg);
    dispatch(resetMsg());
  }, [redux_data.msg])

  return (
    <div className="row">
      <div className="col-md-3" style={{ marginRight: 20 }}>
        <img
          style={{ maxWidth: "270px", height: 280 }}
          src={
            state.photo
              ? typeof state.photo === "string"
                ? `/uploads/${state.photo}`
                : `https://ui-avatars.com/api/?size=256&name=${state.name
                  .split(" ")
                  .join("+")}`
              : splitwiselogo
          }
          alt="profile"
        />
      </div>
      <div className="col-md-7">
        <div>
          <form onSubmit={handleCreateGroup}>
            <h3 className="section-heading" style={{ marginTop: 2 }}>START A NEW GROUP</h3>
            <h5 className="mt-3">My group shall be called...</h5>
            <div className="form-group mb-3">
              <input
                value={state.name} ref={inputGroupName}
                onChange={(e) => setState({ ...state, name: e.target.value })}
                className="form-control"
                type="text"
                required
                name="name"
                placeholder="Group Name" style={{ fontSize: 22, color: "black" }}
              />
            </div>
            <h5 >My group photo shall be...</h5>
            <input ref={inputPhoto}
              onChange={(e) => {
                setState({ ...state, photo: e.target.files[0] })
                console.log("-----e.target.files[0]-------", e.target.files[0])
              }}
              className="form-control"
              type="file"
              name="photo"
              required style={{ border: 0, padding: 0 }}
            />
            <button type="submit" className="btn btn-success" style={{ marginTop: "10px" }}>
              Create Group
          </button>
          </form>
          <hr />
          <CreateInvite />
        </div>
      </div>
    </div>
  );
}
