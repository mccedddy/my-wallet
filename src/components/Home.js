import React from "react";

const Home = ({ user, handleLogOut }) => {
  return (
    <div className="h-screen w-screen bg-red">
      <h1>Welcome, {user.email}</h1>
      <button onClick={handleLogOut}>Log Out</button>
    </div>
  );
};

export default Home;
