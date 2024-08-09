import React from "react";

const Records = ({ user }) => {
  return (
    <div className="h-screen w-full flex flex-col items-center">
      <h1 className="w-8/12 mt-8 mb-1 font-bold text-xl text-left">RECORDS</h1>
      <table className="w-8/12">
        <thead>
          <tr>
            <th>DATE</th>
            <th>WALLET</th>
            <th>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Aug 9</td>
            <td>1000</td>
            <td>12000</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Records;
