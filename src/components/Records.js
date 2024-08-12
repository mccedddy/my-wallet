import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

const Records = ({ user, refresh }) => {
  const [records, setRecords] = useState([]);
  const [walletNames, setWalletNames] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch wallet names
  useEffect(() => {
    if (user?.email) {
      const fetchWalletNames = async () => {
        const userDocRef = doc(db, "users", user.email);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setWalletNames(data.wallets || []);
        }
        setLoading(false);
      };

      fetchWalletNames();
    }
  }, [user, refresh]);

  // Fetch records based on wallet names
  useEffect(() => {
    if (user?.email && walletNames.length > 0) {
      const fetchRecords = async () => {
        const recordsCollectionRef = collection(
          db,
          "users",
          user.email,
          "records"
        );

        const recordsQuery = query(
          recordsCollectionRef,
          orderBy("timestamp", "desc")
        );
        const snapshot = await getDocs(recordsQuery);

        const fetchedRecords = [];

        snapshot.forEach((doc) => {
          if (doc.id !== "latest") {
            const data = doc.data();
            const { timestamp, ...walletBalances } = data;

            const hasRelevantWallets = Object.keys(walletBalances).some(
              (wallet) => walletNames.includes(wallet)
            );

            if (hasRelevantWallets) {
              fetchedRecords.push({
                date: new Date(timestamp).toLocaleDateString(),
                time: new Date(timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }),
                wallets: walletBalances,
              });
            }
          }
        });

        setRecords(fetchedRecords);
      };

      fetchRecords();
    }
  }, [user, walletNames, refresh]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full w-full flex flex-col items-center">
      {!walletNames.length ? (
        <div className="w-full flex">
          <p className="pr-1">You have no wallet.</p>
          <p className="text-red-500 cursor-pointer">Create one</p>.
        </div>
      ) : !records.length ? (
        <div className="w-full flex">
          <p className="pr-1">No records found.</p>
          <p className="text-red-500 cursor-pointer">Create one</p>.
        </div>
      ) : (
        <div className="w-full">
          <button className="bg-red-500 rounded text-white">ADD RECORD</button>
          <table className="my-2 w-full text-sm">
            <thead>
              <tr>
                <th className="border-b w-24">DATE</th>
                {walletNames.map((wallet) => (
                  <th key={wallet} className="border-b">
                    {wallet.toUpperCase()}
                  </th>
                ))}
                <th className="border-b w-24">TOTAL</th>
              </tr>
              <tr className="h-2"></tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <React.Fragment key={index}>
                  <tr className="text-center">
                    {/* Upper part: date time, wallet balances, total */}
                    <td className="border-b">{record.date}</td>
                    {walletNames.map((wallet) => (
                      <td key={wallet} className="border-b">
                        {record.wallets[wallet] || "-"}
                      </td>
                    ))}
                    <td className="border-b" rowSpan="2">
                      {walletNames.reduce((acc, wallet) => {
                        const balance = parseFloat(record.wallets[wallet] || 0);
                        return acc + balance;
                      }, 0)}
                    </td>
                  </tr>
                  <tr className="text-center">
                    {/* Lower part: description */}
                    <td className="border-b text-xs">{record.time}</td>
                    <td
                      colSpan={walletNames.length}
                      className="border-b text-left px-2 text-xs"
                    >
                      Description goes here
                    </td>
                  </tr>
                  <tr className="h-2"></tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Records;
