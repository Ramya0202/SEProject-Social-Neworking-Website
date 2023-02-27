import React, { useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import { logIn, register } from "../../rtk/authSlice";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
import { Images } from "../../assets/images";
import { logIn, register } from "../../redux/action/AuthActions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Authentication = () => {
  const initialState = {
    email: "",
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    confirmpass: "",
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isSignUp, setIsSignUp] = useState(false);
  const [data, setData] = useState(initialState);
  const [confirmPass, setConfirmPass] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(true);

  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*]).{8,}$/;
  const emailRegex = /^[^\s@]+@albany\.edu$/i;

  const resetForm = () => {
    setData(initialState);
    setConfirmPass(confirmPass);
    setIsPasswordValid(true);
    setIsValidEmail(true);
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    setConfirmPass(true);
    e.preventDefault();
    if (isSignUp) {
      if (data.password === data.confirmpass && isPasswordValid && isValidEmail)
        dispatch(register(data, navigate));
      else if (
        data.password === data.confirmpass &&
        !isPasswordValid &&
        isValidEmail
      ) {
        setIsPasswordValid(false);
      } else if (
        data.password !== data.confirmpass &&
        isPasswordValid &&
        isValidEmail
      ) {
        setConfirmPass(false);
      } else if (
        data.password === data.confirmpass &&
        isPasswordValid &&
        !isValidEmail
      ) {
        setIsValidEmail(false);
      } else if (
        data.password !== data.confirmpass &&
        isPasswordValid &&
        !isValidEmail
      ) {
        setIsValidEmail(false);
      } else if (
        data.password === data.confirmpass &&
        !isPasswordValid &&
        !isValidEmail
      ) {
        setIsValidEmail(false);
      }
    } else {
      dispatch(logIn(data, navigate));
    }
  };

  return (
    <div className="Auth">
      <NotificationContainer />
      <ToastContainer />
      <div className="a-right">
        <form onSubmit={handleSubmit} className="infoForm authForm">
          <h3>{isSignUp ? "Create Account" : "Login Your Account"}</h3>
          <div>
            <input
              required
              type="text"
              placeholder="Email Address"
              className="infoInput"
              name="email"
              value={data.email}
              onChange={(e) => {
                handleChange(e);
                setIsValidEmail(emailRegex.test(e.target.value));
              }}
            />
          </div>
          {isSignUp && (
            <>
              <div>
                <input
                  required
                  type="text"
                  placeholder="Username"
                  className="infoInput"
                  name="username"
                  value={data.username}
                  onChange={handleChange}
                />
                <input
                  required
                  type="text"
                  placeholder="Your Name"
                  className="infoInput"
                  name="firstname"
                  value={data.firstname}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div>
            <input
              required
              type="password"
              className={
                isSignUp && !isPasswordValid
                  ? "infoInput not-valid"
                  : "infoInput"
              }
              placeholder="Password"
              name="password"
              value={data.password}
              onChange={(e) => {
                handleChange(e);
                setIsPasswordValid(passwordRegex.test(e.target.value));
              }}
            />
            {isSignUp && (
              <input
                required
                type="password"
                className="infoInput"
                name="confirmpass"
                placeholder="Confirm Password"
                onChange={(e) => {
                  handleChange(e);
                  data.password === e.target.value
                    ? setConfirmPass(true)
                    : setConfirmPass(false);
                }}
              />
            )}
          </div>

          {isSignUp && !isPasswordValid && (
            <div>
              <span className="valid-password-text">
                Password must contain at least 8 characters, including <br />{" "}
                upper/lowercase and numbers
              </span>
            </div>
          )}

          {isSignUp && !isValidEmail && (
            <div>
              <span className="valid-password-text">
                You cannot register with this email account
              </span>
            </div>
          )}

          <span
            className="valid-password-text"
            style={{
              display: confirmPass ? "none" : "block",
            }}
          >
            Confirm password is not same
          </span>
          <div>
            <button className="button infoButton" type="Submit">
              {false ? "Loading..." : isSignUp ? "SignUp" : "Login"}
            </button>
          </div>
        </form>
        <span
          style={{
            fontSize: "14px",
            cursor: "pointer",
            textDecoration: "underline",
            marginTop: "1rem",
          }}
          onClick={() => {
            resetForm();
            setIsSignUp((prev) => !prev);
          }}
        >
          {isSignUp
            ? "Already have an account? Login"
            : "Don't have an account? Sign up"}
        </span>
      </div>

      <div className="a-left">
        <img src={Images.LOGIN_LOGO} alt="" />

        {/* <div className="Webname">
          <h1>Social Media Platform</h1>
          <h6>Explore the ideas throughout the world</h6>
        </div> */}
      </div>
    </div>
  );
};

export default Authentication;
