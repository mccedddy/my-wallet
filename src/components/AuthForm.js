import React, { useState } from "react";
import { toastSuccess, toastError } from "../toastUtils";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import WalletIcon from "../assets/icons/wallet.svg";

const AuthForm = ({ handleSignUp, handleLogIn }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => setIsLogin(!isLogin);

  const checkUsernameExists = async (username) => {
    const querySnapshot = await getDocs(
      query(collection(db, "users"), where("username", "==", username))
    );
    return !querySnapshot.empty;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      try {
        await handleLogIn(email, password);
        toastSuccess("Logged in successfully!");
      } catch (error) {
        if (error.code === "auth/invalid-credential") {
          toastError("Incorrect email or password!");
        } else {
          toastError(`Log In Error: ${error.message || error}`);
          console.log("Log In Error:", error.message);
        }
      }
    } else {
      try {
        const usernameExists = await checkUsernameExists(username);
        if (usernameExists) {
          toastError("Username is already taken. Please choose another one.");
          return;
        }

        await handleSignUp(username, email, password);
        toastSuccess("Signed up successfully!");
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          toastError("Email is already taken");
        } else if (error.code === "auth/weak-password") {
          toastError("Password is too weak. Minimum of 6 characters.");
        } else {
          toastError(`Sign Up Error: ${error.message || error}`);
          console.log("Sign Up Error:", error.message);
        }
      }
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col gap-16 lg:flex-row justify-center items-center">
      <div className=" h-1/6 flex flex-col items-center justify-center">
        <div className="h-full flex justify-center items-center gap-2">
          <img src={WalletIcon} alt="wallet" className="h-full w-36 h-36" />
          <div className="flex flex-col justify-center items-start">
            <h1 className="text-3xl">My Wallet</h1>
            <h1 className="text-text-dark mt-4 text-sm">
              Track your wallets, visualize your growth.
            </h1>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/3 h-3/6 flex flex-col items-center justify-center">
        <div className="w-10/12 lg:m-0 flex flex-col justify-center items-center gap-2 p-6 rounded-lg bg-background-light shadow-lg">
          <h1 className="text-2xl mb-2">{isLogin ? "Log In" : "Sign Up"}</h1>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
            {!isLogin && (
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="text-text bg-background-lighter outline-none rounded py-1 px-2"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-text bg-background-lighter outline-none rounded py-1 px-2"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="text-text bg-background-lighter outline-none rounded py-1 px-2"
            />
            <button
              type="submit"
              className="rounded py-1 px-2 mt-2 bg-accent text-background-light"
            >
              {isLogin ? "Log In" : "Sign Up"}
            </button>
          </form>
          {isLogin ? (
            <div className="flex gap-1 mt-2">
              <p className="text-xs">Don't have an account?</p>
              <button
                onClick={toggleForm}
                className="underline text-xs text-accent bg-background-light outline-none"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="flex gap-1 mt-2">
              <p className="text-xs">Already have an account?</p>
              <button
                onClick={toggleForm}
                className="underline text-xs text-accent bg-background-light"
              >
                Log In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
