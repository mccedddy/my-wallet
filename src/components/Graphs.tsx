import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { fetchWalletValues } from '../services/walletService';
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
  const records = useSelector((state: any) => state.records.records); 
  const wallets = useSelector((state: any) => state.wallets.wallets);
  const [barData, setBarData] = useState<any>(null);
  const [lineData, setLineData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (records.length === 0 || wallets.length === 0) {
        console.error('No records or wallets found.');
        return;
      }
  
      // Fetch wallet values
      const recordIds = records.map((record: any) => record.id);
      const walletValuesData = await fetchWalletValues(recordIds);
  
      if (walletValuesData.length === 0) {
        console.error('No wallet values found.');
        return;
      }
  
      // Get latest record wallet bvalues
      const latestRecord = records[0];
      const latestWalletValues = walletValuesData.filter(
        (walletValue: any) => walletValue.record_id === latestRecord.id
      );
  
      // Bar graph data
      const barDatasets = latestWalletValues.map((walletValue: any) => {
        const wallet = wallets.find((w: any) => w.id === walletValue.wallet_id);
        return {
          label: wallet?.name || 'Unknown Wallet',
          data: [walletValue.value],
          backgroundColor: wallet?.color || 'rgba(0, 0, 0, 0.8)',
          borderColor: wallet?.color || 'rgba(0, 0, 0, 1)',
          borderWidth: 1,
        };
      });
  
      setBarData({
        labels: ['Wallet Balances'],
        datasets: barDatasets,
      });
  
      // Line graph reversed
      const reversedRecords = [...records].reverse();
  
      // Line graph labels
      const lineLabels = reversedRecords.map((record: any) =>
        new Date(record.created_at).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
        })
      );
  
      // Maximum number of labels to show
      const maxLabels = 5;
      const step = Math.ceil(lineLabels.length / maxLabels);
      const limitedLabels = lineLabels.map((label, index) =>
        index % step === 0 ? label : ''
      );
  
      // Line data
      const lineDatasets = wallets.map((wallet: any) => {
        const walletHistory = reversedRecords.map((record: any) => {
          const walletValue = walletValuesData.find(
            (wv: any) =>
              wv.record_id === record.id && wv.wallet_id === wallet.id
          );
          return walletValue ? walletValue.value : 0; 
        });
  
        return {
          label: wallet.name,
          data: walletHistory,
          backgroundColor: wallet.color || 'rgba(0, 0, 0, 0.2)',
          borderColor: wallet.color || 'rgba(0, 0, 0, 1)',
          borderWidth: 2,
        };
      });
  
      // Line total
      const totalHistory = reversedRecords.map((record: any) => {
        return wallets.reduce((sum: number, wallet: any) => {
          const walletValue = walletValuesData.find(
            (wv: any) =>
              wv.record_id === record.id && wv.wallet_id === wallet.id
          );
          return sum + (walletValue ? walletValue.value : 0);
        }, 0);
      });
  
      lineDatasets.push({
        label: 'Total',
        data: totalHistory,
        backgroundColor: 'rgba(180, 180, 180, 1)',
        borderColor: 'rgba(180, 180, 180, 1)',
        borderWidth: 2,
        borderDash: [1, 1], 
      });
  
      setLineData({
        labels: limitedLabels,
        datasets: lineDatasets,
      });
    };
  
    fetchData();
  }, [records, wallets]);

  // Options
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Wallet History Over Time',
        color: '#FFFFFF',
        font: {
          size: 16,
          weight: 400,
        }
      },
    },
    elements: {
      point: {
        radius: 0.5,
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 0,
          minRotation: 0, 
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Wallet Balances (Latest Record)',
        color: '#FFFFFF',
        font: {
          size: 16,
          weight: 400,
        }
      },
    },
  };

  return (
    <div className='graphs'>
      {lineData && <Line className='graph' data={lineData} options={lineOptions} redraw={true} />}
      {barData && <Bar className='graph' data={barData} options={barOptions} redraw={true} />}
    </div>
  );
}

export default Graphs;