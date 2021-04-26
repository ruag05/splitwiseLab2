import axios from "axios";
const logout = () => {
  axios
    .post("/users/logout")
    .then((res) => {
      localStorage.clear();
      window.location.replace("/");
    })
    .catch((err) => {
      alert(err);
    });
};
export default logout;
