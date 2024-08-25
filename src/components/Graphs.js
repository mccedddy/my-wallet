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
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const Graphs = ({ user }) => {
  const [wallets, setWallets] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(true);

  // Fetch wallet names
  useEffect(() => {
    if (user?.email) {
      const fetchWalletNames = async () => {
        setLoading(true);
        const userDocRef = doc(db, "users", user.email);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setWallets(data.wallets || []);
        }
        setLoading(false);
      };
      fetchWalletNames();
    }
  }, [user]);

  // Fetch records based on wallet names
  useEffect(() => {
    if (user?.email && wallets.length > 0) {
      const fetchRecords = async () => {
        const recordsCollectionRef = collection(
          db,
          "users",
          user.email,
          "records"
        );

        const recordsQuery = query(
          recordsCollectionRef,
          orderBy("timestamp", "asc")
        );
        const snapshot = await getDocs(recordsQuery);

        const fetchedRecords = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          const { timestamp, description, id, ...walletBalances } = data;

          const hasRelevantWallets = Object.keys(walletBalances).some(
            (wallet) => wallets.includes(wallet)
          );

          if (hasRelevantWallets) {
            // Calculate total
            const totalBalance = wallets.reduce((acc, wallet) => {
              const balance = parseFloat(walletBalances[wallet] || 0);
              return acc + balance;
            }, 0);

            fetchedRecords.push({
              id: id,
              date: new Date(timestamp).toLocaleDateString(),
              time: new Date(timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }),
              wallets: walletBalances,
              total: totalBalance,
              description: description,
            });
          }
        });

        setRecords(fetchedRecords);
        setLoadingRecords(false);
      };

      fetchRecords();
    } else {
      setLoading(false);
    }
  }, [user, wallets]);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Graph data
  const chartData = {
    labels: records.map((record) => record.date),
    datasets: [
      ...wallets.map((wallet) => ({
        label: wallet,
        data: records.map((record) => record.wallets[wallet] || 0),
        borderColor: getRandomColor(),
        fill: false,
        borderWidth: 2,
      })),
      {
        label: "Total",
        data: records.map((record) => record.total || 0),
        borderColor: "#8b8288",
        fill: false,
        borderDash: [2, 2],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        ticks: {
          color: "#e3e2ec",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#e3e2ec",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#e3e2ec",
        },
      },
    },
    responsive: true,
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center">
        <div className="w-6 mt-32 spinner"></div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col items-center">
      {/* TODO: date filter */}
      {records.length > 0 && wallets.length > 0 ? (
        <div className="w-full flex flex-col items-center p-4 pt-2 mb-4 rounded-lg bg-background-light">
          <h1 className="m-1 text-lg">WALLET BALANCES OVER TIME</h1>
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : loadingRecords ? (
        <div className="flex flex-col justify-center items-center">
          <div className="w-6 mt-32 spinner"></div>
        </div>
      ) : (
        <p className="pr-1 text-left w-full">No data available to display.</p>
      )}
    </div>
  );
};

export default Graphs;
