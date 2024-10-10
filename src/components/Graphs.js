import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
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
  const [recordLimit, setRecordLimit] = useState("5");

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

  // Fetch records based on wallet names and filters
  useEffect(() => {
    if (user?.email && wallets.length > 0) {
      const fetchRecords = async () => {
        let recordsQuery;
        const recordsCollectionRef = collection(
          db,
          "users",
          user.email,
          "records"
        );

        recordsQuery = query(
          recordsCollectionRef,
          orderBy("timestamp", "desc")
        );
        if (recordLimit !== "ALL") {
          recordsQuery = query(recordsQuery, limit(parseInt(recordLimit)));
        }

        const snapshot = await getDocs(recordsQuery);

        let fetchedRecords = [];

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

        if (fetchedRecords.length > 0) {
          fetchedRecords.reverse();
        }

        setRecords(fetchedRecords);
        setLoadingRecords(false);
      };

      fetchRecords();
    } else {
      setLoading(false);
    }
  }, [user, wallets, recordLimit]);

  // Colors
  const colorPalette = [
    "#FF0000",
    "#FF7F00",
    "#FFFF00",
    "#00FF00",
    "#0000FF",
    "#9400D3",
    "#f0289d",
  ];

  let usedColors = [];

  const getRandomColor = () => {
    if (colorPalette.length === usedColors.length) {
      usedColors = [];
    }

    let color;
    do {
      color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    } while (usedColors.includes(color));

    usedColors.push(color);
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
      {records.length > 0 && wallets.length > 0 ? (
        <div className="w-full flex flex-col items-center p-4 pt-2 mb-4 rounded-lg bg-background-light">
          <h1 className="m-1 text-lg">WALLET BALANCES OVER TIME</h1>
          <div className="flex flex-wrap gap-2 w-full m-2">
            <h1>Show:</h1>
            <select
              className="rounded w-22 text-text-dark bg-background outline-none"
              value={recordLimit}
              onChange={(e) => setRecordLimit(e.target.value)}
            >
              <option value="ALL">ALL</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
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
