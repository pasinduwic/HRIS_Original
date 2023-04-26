import { useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import {
  addAlertDetails,
  addSessionUser
} from "../../redux/features/StatusVar";
import logo from "../../images/google.png";

interface signinUserI {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SigninForm = () => {
  const [signinData, setSigninData] = useState<signinUserI>();
  const [errors, setErrors] = useState<signinUserI>();
  const [loaderStatus, setLoaderStatus] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handelOnChange = (e: any) => {
    const key = e.target.getAttribute("name");
    const enteredValue = e.target.value;

    setSigninData((prevState: any) => ({
      ...prevState,
      [key]: enteredValue
    }));

    if (errors) {
      if (errors[key as keyof typeof signinData] as signinUserI) {
        setErrors(
          (pre) =>
            ({
              ...pre,
              [key]: null
            } as any)
        );
      }
    }

    // console.log(signinData);
  };

  const signinRequest = async (data: any) => {
    try {
      console.log(data);
      const responce = await axios.post(
        "https://gg85fw-3000.csb.app/api/users/signin",
        data
      );
      // console.log(responce.data);
      const user = responce.data;
      if (user.error) {
        console.log(user.error);

        return dispatch(
          addAlertDetails({
            status: true,
            type: "danger",
            message: "Server error!!"
          })
        );
      }
      if (user.errorSpecified) {
        // console.log(user.error);

        return dispatch(
          addAlertDetails({
            status: true,
            type: "danger",
            message: user.errorSpecified
          })
        );
      }
      dispatch(addSessionUser({ type: "add", payload: user }));
      navigate("/home");
    } catch (e) {
      console.log(e);

      dispatch(
        addAlertDetails({
          status: true,
          type: "danger",
          message: "Something went wrong!!"
        })
      );
    } finally {
      setLoaderStatus(false);
    }
  };

  const useGoogle = async () => {
    try {
      const user = await signInWithPopup(auth, provider);
      // console.log(user.user);
      const data = {
        displayName: user.user.displayName,
        email: user.user.email,
        password: user.user.uid,
        imagePath: user.user.photoURL
      };
      signinRequest(data);
      // console.log(newUser);
      // if (!newUser.error) {
      //   dispatch(
      //     addSessionUser({
      //       type: "add",
      //       payload: newUser
      //     })
      //   );
      //   navigate("/home");
      // }
    } catch (e) {
      dispatch(
        addAlertDetails({
          status: true,
          type: "danger",
          message: "Something went wrong!!"
        })
      );
    }
  };

  const validateForm = () => {
    // console.log(signinData);
    let status = true;
    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])((?!password).){8,}$/;

    if (!signinData?.fullName || signinData?.fullName === "") {
      setErrors(
        (pre) =>
          ({
            ...pre,
            fullName: "Full name is required!"
          } as any)
      );
      status = false;
    }
    if (!signinData?.email || signinData?.email === "") {
      setErrors(
        (pre) =>
          ({
            ...pre,
            email: "Email is required!"
          } as any)
      );
      status = false;
    } else if (!regexEmail.test(signinData?.email)) {
      setErrors(
        (pre) =>
          ({
            ...pre,
            email: "Email is not valid!"
          } as any)
      );
      status = false;
    }
    if (!signinData?.password || signinData?.password === "") {
      setErrors(
        (pre) =>
          ({
            ...pre,
            password: "Password is required!"
          } as any)
      );
      status = false;
    } else if (!regexPassword.test(signinData?.password)) {
      setErrors(
        (pre) =>
          ({
            ...pre,
            password: "Password is not valid!"
          } as any)
      );
      status = false;
    }
    if (!signinData?.confirmPassword || signinData?.confirmPassword === "") {
      setErrors(
        (pre) =>
          ({
            ...pre,
            confirmPassword: "Confirm password is required!"
          } as any)
      );
      status = false;
    } else if (!regexPassword.test(signinData?.password)) {
      setErrors(
        (pre) =>
          ({
            ...pre,
            confirmPassword: "Confirm password is not valid!"
          } as any)
      );
      status = false;
    } else if (!(signinData?.password === signinData?.confirmPassword)) {
      setErrors(
        (pre) =>
          ({
            ...pre,
            confirmPassword: "Passwords should match!"
          } as any)
      );
      status = false;
    }
    // console.log(errors);
    return status;
  };

  const handleSignin = async (e: any) => {
    // console.log("check");

    e.preventDefault();
    const isValid = validateForm();

    const data = {
      displayName: signinData?.fullName,
      email: signinData?.email,
      password: signinData?.password
    };
    if (isValid) {
      setLoaderStatus(true);
      signinRequest(data);
      // console.log(user);
      // if (!user.error) {
      //   dispatch(
      //     addSessionUser({
      //       type: "add",
      //       payload: user
      //     })
      //   );
      //   navigate("/home");
      // } else {
      //   console.log(user.error);
      // }
    }
  };
  return (
    <div className="login-form">
      <Form className="mt-3">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="email"
            placeholder="Full Name"
            name="fullName"
            onChange={handelOnChange}
            isInvalid={!!errors?.fullName}
            className="bg-dark text-light"
          />
          <Form.Control.Feedback type="invalid">
            {errors?.fullName}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            onChange={handelOnChange}
            isInvalid={!!errors?.email}
            className="bg-dark text-light"
          />
          <Form.Control.Feedback type="invalid">
            {errors?.email}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            onChange={handelOnChange}
            isInvalid={!!errors?.password}
            className="bg-dark text-light"
          />
          <Form.Control.Feedback type="invalid">
            {errors?.password}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={handelOnChange}
            isInvalid={!!errors?.confirmPassword}
            className="bg-dark text-light"
          />
          <Form.Control.Feedback type="invalid">
            {errors?.confirmPassword}
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          variant="secondary"
          type="submit"
          onClick={handleSignin}
          className="mb-3 w-100"
        >
          {loaderStatus ? (
            <Spinner animation="border" variant="secondary" />
          ) : (
            "Sign in"
          )}
        </Button>
      </Form>
      <div className="login-options">
        <p style={{ margin: "0" }}>
          Signin with{" "}
          <button
            style={{
              background: "none",
              border: "none",
              color: "#0d6efd",
              textDecoration: "underline"
            }}
            onClick={useGoogle}
          >
            <img src={logo} alt="" style={{ width: "40px" }} />
          </button>
        </p>
      </div>
    </div>
  );
};

export default SigninForm;
