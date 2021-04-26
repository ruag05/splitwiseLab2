import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAlert } from "react-alert";
import { timezones } from "../utils/timezones";
import { currencies } from "../utils/currency";
import { languages } from "../utils/language";
import "./Profile.css";
import avatar from "../images/avatar.png"
import { InputGroup, FormControl } from 'react-bootstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

import { useSelector, useDispatch } from "react-redux";
import { updateProfilePic, updateProfile, getUsers } from '../Actions/ProfileActions';
import { setSingleData } from '../reducer/ProfileReducer';

const initState = {
  name: "",
  email: "",
  phone: "",
  photo: "",
  currency: "USD",
  timezone: "Africa/Abidjan",
  language: "Arabic",
};

export default function Profile() {
  const dispatch = useDispatch();
  const redux_data = useSelector(state => state.profile);

  const alert = useAlert();

  const [editmode, changeEdit] = useState(false)
  const [editmode2, changeEdit2] = useState(false)
  const [editmode3, changeEdit3] = useState(false)
  const [changeValue, onChangeValue] = useState('')
  const [user, setUser] = useState(initState);
  const [img, setImg] = useState(null);

  useEffect(() => {
    if (redux_data.msg !== "")
      alert.success(redux_data.msg);
  }, [redux_data.msg])

  const onEdit = () => {
    changeEdit(!editmode)
  }
  const onChangeX = (key, val) => {
    dispatch(setSingleData({ key: key, value: val }));
    changeEdit(false)
  }

  const onEdit2 = () => {
    changeEdit2(!editmode2)
  }
  const onChangeX2 = (key, val) => {
    dispatch(setSingleData({ key: key, value: val }));
    changeEdit2(false)
  }

  const onEdit3 = () => {
    changeEdit3(!editmode3)
  }

  const onChangeX3 = (key, val) => {
    dispatch(setSingleData({ key: key, value: val }));
    changeEdit3(false)
  }

  const onChangeX4 = (key, val) => {
    dispatch(setSingleData({ key: key, value: val }));
  }

  const onFileChangeHandler = (e) => {
    e.preventDefault();
    setImg(e.target.files[0]);
  };

  const handleImageUpload = (e) => {
    const data = new FormData();
    data.append("photo", img);
    e.preventDefault();
    axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
    axios.defaults.withCredentials = true;
    dispatch(updateProfilePic(data));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let data = {};
    for (let [key, value] of Object.entries(user)) {
      data[key] = value;
    }

    axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
    axios.defaults.withCredentials = true;
    const reduxData = {
      name: redux_data.name,
      email: redux_data.email,
      phone: redux_data.phone,
      photo: redux_data.photo,
      currency: redux_data.currency,
      timezone: redux_data.timezone,
      language: redux_data.language
    }
    dispatch(updateProfile(reduxData));
  };

  const { name, email, phone, photo, currency, timezone, language } = user;

  useEffect(() => {
    axios.defaults.headers.common["authorization"] = localStorage.getItem('token')
    axios.defaults.withCredentials = true;
    dispatch(getUsers());
  }, []);

  return (
    <div className="container-sm">
      <br />
      <h2 className="heading">Your Account</h2>
      <div className="row mt-2" style={{ borderTop: '0.2px solid #888' }}>
        <div className="col-md-4 mr-4 mt-3" style={{ paddingLeft: 100 }}>
          <img
            s style={{ maxWidth: "270px", height: 280, borderRadius: 160 }}
            src={
              redux_data.photo
                ? typeof photo === "string"
                  ? `/uploads/${redux_data.photo}`
                  : `https://ui-avatars.com/api/?size=256&name=${name
                    .split(" ")
                    .join("+")}`
                : avatar
            }
            alt="profile"
          />
          <h5 className="my-2 ml-1">Change your avatar</h5>
          <form onSubmit={handleImageUpload}>
            <input style={{ marginTop: "5px", marginLeft: "4px" }}
              name="photo"
              type="file"
              onChange={onFileChangeHandler}
            />
            <button type="submit" className="btn btn-success" style={{ marginTop: "12px", marginLeft: "4px" }}>
              Update Picture
            </button>
          </form>
        </div>
        <div className="col-md-7 mt-3" >
          <form onSubmit={handleSubmit}>
            <div className="row mt-3">
              <div className="col-md-7 px-4" style={{ borderLeft: '0.2px solid #888' }}>
                <h5 htmlFor="name">Your Name</h5>
                {editmode ? <div>

                  <input name="name" id="name" type="text" pattern="[a-zA-Z0-9 ]{4,16}"
                    placeholder={redux_data.name} style={{ marginRight: 5 }}
                  />
                  <FontAwesomeIcon icon={faCheckCircle} style={{ marginTop: "10", marginRight: "5", color: 'grey', cursor: 'pointer' }} onClick={() => { onChangeX('name', document.getElementById('name').value) }} />
                  <FontAwesomeIcon icon={faTimesCircle} style={{ marginTop: "10", color: 'grey', cursor: 'pointer' }} onClick={() => onEdit()} />

                </div> :
                  <table>
                    <tr>
                      <td>
                        <input
                          type="text"
                          className="form-control mb-3"
                          name="name" readOnly
                          value={redux_data.name}
                          placeholder="Name"
                        />
                      </td>
                      <td >
                        <FontAwesomeIcon icon={faEdit} size="2x" style={{ color: 'grey', marginBottom: "20", height: 20, cursor: 'pointer' }} onClick={() => onEdit()} />
                      </td>
                    </tr>
                  </table>
                }
                <h5 htmlFor="email">Your Email</h5>
                {editmode2 ? <div>
                  <InputGroup className="mb-3" style={{ width: "75%" }}>
                    <input name="email" id="email" type="email"
                      placeholder={redux_data.email} style={{ marginRight: 5 }}
                    />
                    <FontAwesomeIcon icon={faCheckCircle} style={{ marginTop: "10", marginRight: "5", color: 'grey', cursor: 'pointer' }} onClick={() => { onChangeX2('email', document.getElementById('email').value) }} />
                    <FontAwesomeIcon icon={faTimesCircle} style={{ marginTop: "10", color: 'grey', cursor: 'pointer' }} onClick={() => onEdit2()} />
                  </InputGroup>
                </div> :
                  <table>
                    <tr>
                      <td>
                        <input
                          type="email"
                          className="form-control mb-3"
                          name="email" readOnly
                          value={redux_data.email}
                          placeholder="Email"
                        />
                      </td>
                      <td >
                        <FontAwesomeIcon icon={faEdit} size="2x" style={{ color: 'grey', marginBottom: "20", height: 20, cursor: 'pointer' }} onClick={() => onEdit2()} />
                      </td>
                    </tr>
                  </table>
                }
                <h5 htmlFor="phone">Your Phone</h5>
                {editmode3 ? <div>
                  <InputGroup className="mb-3" style={{ width: "75%" }}>
                    <FormControl name="phone" id="phone" type="number"
                      placeholder={redux_data.phone} style={{ marginRight: 5 }}
                    />
                    <FontAwesomeIcon icon={faCheckCircle} style={{ marginTop: "10", marginRight: "5", color: 'grey', cursor: 'pointer' }} onClick={() => { onChangeX3('phone', document.getElementById('phone').value) }} />
                    <FontAwesomeIcon icon={faTimesCircle} style={{ marginTop: "10", color: 'grey', cursor: 'pointer' }} onClick={() => onEdit3()} />
                  </InputGroup>
                </div> :
                  <table>
                    <tr>
                      <td>
                        <input
                          type="tel"
                          className="form-control mb-3"
                          name="phone" readOnly
                          value={redux_data.phone}
                          placeholder="Phone Number"
                        />
                      </td>
                      <td >
                        <FontAwesomeIcon icon={faEdit} size="2x" style={{ color: 'grey', marginBottom: "20", height: 20, cursor: 'pointer' }} onClick={() => onEdit3()} />
                      </td>
                    </tr>
                  </table>
                }
              </div>
              <div className="col-md-5">
                <h5 htmlFor="currency">Your default currency</h5>
                <select
                  name="currency" id="currency" defaultValue=""
                  onChange={() => { onChangeX4('currency', document.getElementById('currency').value) }}
                  className="form-control form-select mb-3"
                  value={redux_data.currency}
                >
                  {
                    currencies.map((t, i) => (
                      <option value={t} key={i}>{t}</option>
                    ))
                  }
                </select>

                <h5 htmlFor="timezone">Your default timezone</h5>
                <select
                  name="timezone" id="timezone"
                  onChange={() => { onChangeX4('timezone', document.getElementById('timezone').value) }}
                  className="form-control form-select mb-3"
                  value={redux_data.timezone}
                >
                  {
                    timezones.map((t, i) => (
                      <option value={t} key={i}>{t}</option>
                    ))
                  }
                </select>

                <h5 htmlFor="language">Your default language</h5>
                <select
                  name="language" id="language"
                  onChange={() => { onChangeX4('language', document.getElementById('language').value) }}
                  className="form-control form-select mb-3"
                  value={redux_data.language}
                >
                  {
                    languages.sort().map((t, i) => (
                      <option value={t} key={i}>{t}</option>
                    ))
                  }
                </select>
              </div>
            </div>
            <div className="row">
              <button
                type="submit"
                className="btn btn-success ml-auto mr-3"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
