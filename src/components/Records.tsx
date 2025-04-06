import React from 'react';
import RecordItem from './RecordItem';
import { useSelector } from "react-redux";

function Records() {
  const currentPage = useSelector((state: any) => state.global.currentPage);
  const wallets = useSelector((state: any) => state.wallets.wallets); 
  const records = useSelector((state: any) => state.records.records);

  // Format timestamp to YYYY-MM-DD or HH:MM:SS
  const formatDateTime = (timestamp: string, type: string = 'datetime') => {
    if (!timestamp) return "N/A"; 
    const date = new Date(timestamp);

    if (type === 'date') {
      // Format date to YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } else if (type === 'time') {
      // Format time to HH:MM:SS
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    } else {
      // Format full datetime to YYYY-MM-DD HH:MM:SS
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} | ${hours}:${minutes}:${seconds}`;
    }
  };

  if (currentPage === 'Records') {
    return (
      <div className='records'>
        {records.length > 0 ? (
          records.map((record: any) => (
            <RecordItem
              key={record.id}
              data={{
                id: record.id,
                title: formatDateTime(record.created_at),
                date: formatDateTime(record.created_at, 'date'),
                time: formatDateTime(record.created_at, 'time'),
                description: record.description || "No description",
              }}
            />
          ))
        ) : (
          <p>No records available.</p>
        )}
      </div>
    );
  } else {
    return (
      <div className='records'>
        {wallets.length > 0 ? (
          wallets.map((wallet: any) => (
            <RecordItem
              key={wallet.id}
              data={{
                id: wallet.id,
                title: wallet.name,
                value: wallet.value,
                color: wallet.color,
                order: wallet.position,
                description: `Last updated at: ${formatDateTime(wallet.last_updated)}`, 
              }}
            />
          ))
        ) : (
          <p>No wallets available.</p>
        )}
        {/* {wallets.map((wallet: any) => (
          <RecordItem
            key={wallet.id}
            data={{
              id: wallet.id,
              title: wallet.name,
              value: wallet.value,
              color: wallet.color,
              order: wallet.position,
              description: `Last updated at: ${formatDateTime(wallet.last_updated)}`, 
            }}
          />
        ))} */}
      </div>
    );
  }
}

export default Records;