import React from "react";
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
  });

  const { user, loading, error, dispatch } = useContext(AuthContext);

  const navigate = useNavigate()
  // khi thay doi field
  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // submit
  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      // console.log(credentials)
      const res = await axios.post("/auth/login", credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data }); // user trong AuthContext sẽ là JSON thông tin user (kq API return)
      console.log(res.data.isAdmin)
      if (res.data.isAdmin) { 
        console.log("den trang adminstrator")
        navigate("/administrator") 
      } else navigate("/")
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };

  return (
    <div className="login">
      <div className="lContainer">
        <h1 className="Login">Đăng nhập</h1>
        <input
          type="text"
          placeholder="username"
          id="username"
          onChange={handleChange}
          className="lInput"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          onChange={handleChange}
          className="lInput"
        />

        {/* <label>
            <input 
            type="checkbox" 
            name="remember" 
            /> 
            Remember Me
          </label> */}

        <button disabled={loading} onClick={handleClick} className="lButton">
          Đăng nhập
        </button>
        <Link className="lButton register" to="/register">

          Đăng ký

        </Link>
        {error && <span>{error.message}</span>}
      </div>
    </div>
  );
};

export default Login;