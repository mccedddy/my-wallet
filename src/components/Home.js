import React from "react";

const Home = ({ user }) => {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-red-100">
      <h1>Welcome, {user.email}!</h1>
    </div>
  );
};

export default Home;
