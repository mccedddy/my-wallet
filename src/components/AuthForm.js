import React, { useState } from "react";
import { toastSuccess, toastError } from "../toastUtils";

const AuthForm = ({ handleSignUp, handleLogIn }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => setIsLogin(!isLogin);

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
        }
      }
    } else {
      try {
        await handleSignUp(username, email, password);
        toastSuccess("Signed up successfully!");
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          toastError("Email is already taken");
        } else if (error.code === "auth/weak-password") {
          toastError("Password is too weak. Minimum of 6 characters.");
        } else {
          toastError(`Sign Up Error: ${error.message || error}`);
        }
      }
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="w-10/12 md:w-6/12 lg:w-4/12 flex flex-col justify-center items-center gap-2 py-4 px-6 rounded-lg bg-background-light shadow-lg">
        <h1 className="text-2xl mb-2">{isLogin ? "Log In" : "Sign Up"}</h1>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="text-text bg-background-lighter rounded py-1 px-2"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="text-text bg-background-lighter rounded py-1 px-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="text-text bg-background-lighter rounded py-1 px-2"
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
              className="underline text-xs text-accent bg-background-light"
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
  );
};

export default AuthForm;
