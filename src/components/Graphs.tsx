import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Graphs() {
  // Data for the Line Graph
  const lineData = {
    labels: ['3/23', '3/24', '3/25', '3/26', '3/27', '3/28', '3/29'],
    datasets: [
      {
        label: 'Wallet 1',
        data: [65, 59, 80, 81, 90, 66, 45],
        backgroundColor: 'rgba(75, 97, 192, 0.2)',
        borderColor: 'rgb(75, 97, 192)',
      },
      {
        label: 'Wallet 2',
        data: [10, 40, 23, 66, 56, 55, 40],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
      {
        label: 'Wallet 3',
        data: [30, 50, 70, 60, 80, 90, 100],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
      },
      {
        label: 'Wallet 4',
        data: [20, 30, 50, 40, 60, 70, 80],
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
      },
      {
        label: 'Wallet 5',
        data: [15, 25, 35, 45, 55, 65, 75],
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
      },
    ],
  };

  // Data for the Bar Graph
  const barData = {
    labels: ['Wallet Balances'],
    datasets: [
      {
        label: 'Wallet 1',
        data: [12],
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Wallet 2',
        data: [7],
        backgroundColor: 'rgba(99, 255, 159, 0.8)',
        borderColor: 'rgba(99, 255, 159, 1)',
        borderWidth: 1,
      },
      {
        label: 'Wallet 3',
        data: [10],
        backgroundColor: 'rgba(99, 148, 255, 0.8)',
        borderColor: 'rgba(99, 148, 255, 1)',
        borderWidth: 1,
      },
      {
        label: 'Wallet 4',
        data: [6],
        backgroundColor: 'rgba(255, 143, 99, 0.8)',
        borderColor: 'rgba(255, 143, 99, 1)',
        borderWidth: 1,
      },
      {
        label: 'Wallet 5',
        data: [4],
        backgroundColor: 'rgba(226, 255, 99, 0.8)',
        borderColor: 'rgba(226, 255, 99, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Options for both graphs
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Sample Chart',
      },
    },
  };

  return (
    <div className='graphs'>
        <Line className='graph' data={lineData} options={options} redraw={true} />
        <Bar className='graph' data={barData} options={options} redraw={true} />
    </div>
  );
}

export default Graphs;