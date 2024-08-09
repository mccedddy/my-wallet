import React from "react";
import Sidebar from "./Sidebar";
import Records from "./Records";

const Home = ({ user }) => {
  return (
    <div className="h-screen w-full flex bg-red-100">
      <Sidebar user={user} />
      <Records user={user} />
    </div>
  );
};

export default Home;
