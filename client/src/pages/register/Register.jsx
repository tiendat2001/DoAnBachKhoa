import React from "react";
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Register = () => {
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
  });

  const {user, loading, error, dispatch } = useContext(AuthContext);

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
      const res = await axios.post("/auth/login", credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      console.log(user)

      navigate("/")
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };

  return (
    <div className="login">
      <div className="lContainer">
      <h1 className="Login">Register</h1>
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

          <input
          type="password"
          placeholder="Email"
          id="password"
          onChange={handleChange}
          className="lInput"
        />

        <input
          type="password"
          placeholder="Phone"
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
         
      
        
        <button  className="lButton btn_registerr">
          Save
        </button>
        {error && <span>{error.message}</span>}
      </div>
    </div>
  );
};

export default Register;