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
        <p className="mt-6">You have no wallet. Create one.</p>
      ) : !records.length ? (
        <p className="mt-6">No records found. Create one.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b">DATE TIME</th>
              {walletNames.map((wallet) => (
                <th key={wallet} className="border-b">
                  {wallet.toUpperCase()}
                </th>
              ))}
              <th className="border-b">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={index} className="text-center">
                <td className="border-b">{record.date + " " + record.time}</td>
                {walletNames.map((wallet) => (
                  <td key={wallet} className="border-b">
                    {record.wallets[wallet] || "-"}
                  </td>
                ))}
                <td className="border-b">
                  {walletNames.reduce((acc, wallet) => {
                    const balance = parseFloat(record.wallets[wallet] || 0);
                    return acc + balance;
                  }, 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Records;
