import React, { useEffect, useState } from "react";
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
import { useSelector } from "react-redux";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const Graphs = () => {
  const user = useSelector((state) => state.user.value);
  const wallets = useSelector((state) => state.wallet.wallets);
  const records = useSelector((state) => state.wallet.records);

  const [filteredRecords, setFilteredRecords] = useState([]);
  const [recordLimit, setRecordLimit] = useState("10");

  useEffect(() => {
    const filterRecords = () => {
      let filtered = records
        .filter((record) => {
          // Check if the record has relevant wallets
          return Object.keys(record.wallets).some((wallet) =>
            wallets.includes(wallet)
          );
        })
        .map((record) => {
          // Calculate the total balance for relevant wallets
          const totalBalance = wallets.reduce((acc, wallet) => {
            const balance = parseFloat(record.wallets[wallet] || 0);
            return acc + balance;
          }, 0);

          return {
            ...record,
            total: totalBalance,
          };
        })
        .reverse();

      if (recordLimit !== "ALL") {
        filtered = filtered.slice(-parseInt(recordLimit));
      }

      setFilteredRecords(filtered);
    };

    filterRecords();
  }, [user, wallets, records, recordLimit]);

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
    labels: filteredRecords.map((record) => {
      const date = new Date(record.date);
      return date.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
      });
    }),
    datasets: [
      ...wallets.map((wallet) => ({
        label: wallet,
        data: filteredRecords.map((record) => record.wallets[wallet] || 0),
        borderColor: getRandomColor(),
        fill: false,
        borderWidth: 2,
        pointRadius: 1,
      })),
      {
        label: "Total",
        data: filteredRecords.map((record) => record.total || 0),
        borderColor: "#8b8288",
        fill: false,
        borderDash: [2, 2],
        borderWidth: 2,
        pointRadius: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        ticks: {
          color: "#e3e2ec",
          maxTicksLimit: 5,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#e3e2ec",
          maxTicksLimit: 5,
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
    maintainAspectRatio: false,
  };

  return (
    <div className="h-full w-full flex flex-col items-center">
      {filteredRecords.length > 0 && wallets.length > 0 ? (
        <div className="w-full h-full flex flex-col items-center p-4 pt-2 rounded-lg bg-background-light">
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
          <Line
            data={chartData}
            options={chartOptions}
            className="max-h-[300px]"
          />
        </div>
      ) : (
        <p className="pr-1 text-left w-full">No data available to display.</p>
      )}
    </div>
  );
};

export default Graphs;
