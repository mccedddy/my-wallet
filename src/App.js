import React, { useState, useEffect } from "react";
import { auth } from "./firebase/firebaseConfig";
import { signUp, logIn } from "./firebase/authService";
import { onAuthStateChanged } from "firebase/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthForm from "./components/AuthForm";
import Home from "./components/Home";
import Loader from "./components/Loader";
import "./CustomToast.css";
import { useSelector, useDispatch } from "react-redux";
import { setUser, setLoading } from "./reducers/userSlice";

function App() {
  const user = useSelector((state) => state.user.value);
  const loadingUser = useSelector((state) => state.user.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      dispatch(setUser(currentUser));
      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <ToastContainer />
      {loadingUser ? (
        <Loader initial={true} />
      ) : !user ? (
        <AuthForm handleSignUp={signUp} handleLogIn={logIn} />
      ) : (
        <Home />
      )}
    </div>
  );
}

export default App;
