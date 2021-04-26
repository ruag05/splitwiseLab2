import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import axios from "axios";
import { authContext } from "../context/AuthContext";
import cookie from "react-cookies";
import jwt_decode from "jwt-decode";

const initState = {
  name: "",
  email: "",
  password: ""
};

export default function Register() {
  const auth = React.useContext(authContext).state;
  let history = useHistory();
  const [user, setUser] = useState(initState);
  const alert = useAlert();
  let { dispatch } = useContext(authContext);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (user.password === user.cpassword) {
        const { data } = await axios.post("/users/register", user)    
        let decoded = jwt_decode(data.token);
        localStorage.setItem("auth", true, {
          path: '/',
          httpOnly: false,
          maxAge: 9000000
        })
        localStorage.setItem("token", data.token)
        dispatch({ type: "LOG_IN" });
        alert.success(`${data.msg}`);
        history.push("/dashboard");       
      } else {
        alert.error("Passwords Do Not Match");
      }
    }
    catch (error) {
      if (error.response) alert.error(error.response.data.msg);
    }
  };

  useEffect(() => {
    if (auth.loggedIn) {
      history.push("/");
    }
  }, [auth.loggedIn, history]);

  return (
    <div className="container-fluid">
      <div className="row no-gutter">
        <div className="col-md-4 col-lg-4">
          <div className="login d-flex align-items-center py-5">
            <div className="container">
              <div className="row">
                <div className="col-md-9 col-lg-8 mx-auto">
                  <h3 className="login-heading mb-4 px-3">Create account</h3>
                  <form onSubmit={handleRegister}>
                    <div className="form-label-group">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        onChange={handleChange}
                        placeholder="Name"
                        pattern="[a-zA-Z0-9 ]{4,16}"
                        title="Must be 4 to 16 characters in length"
                        required
                        autofocus
                      />
                      <label for="name">Name</label>
                    </div>
                    <div className="form-label-group">
                      <input
                        type="email"
                        id="inputEmail"
                        name="email"
                        className="form-control"
                        onChange={handleChange}
                        placeholder="Email address"
                        required
                        autofocus
                      />
                      <label for="inputEmail">Email address</label>
                    </div>
                    <div className="form-label-group">
                      <input
                        type="password"
                        id="inputPassword"
                        name="password"
                        className="form-control"
                        onChange={handleChange}
                        placeholder="Password"
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
                        title="Must contain at least one digit, one uppercase and lowercase letter, and at least 6 characters"
                        required
                      />
                      <label for="inputPassword">Password</label>
                    </div>
                    <div className="form-label-group">
                      <input
                        type="password"
                        id="inputcPassword"
                        name="cpassword"
                        className="form-control"
                        onChange={handleChange}
                        placeholder="Password"
                        required
                      />
                      <label for="inputcPassword">Confirm Password</label>
                    </div>
                    <button
                      className="btn btn-lg btn-primary btn-block btn-login text-uppercase font-weight-bold mb-2"
                      type="submit">
                      Register
                    </button>
                    <a href="https://www.splitwise.com/terms" style={{ fontSize: 12 }}>
                      By registering, you accept the Splitwise Terms of Service</a>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-none d-md-flex col-lg-4 col-lg-8 bg-image"></div>
      </div>
    </div>
  );
}
