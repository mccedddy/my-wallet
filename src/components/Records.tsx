import React from 'react';
import RecordItem from './RecordItem';
import { useSelector } from "react-redux";

function Records() {
  const currentPage = useSelector((state: any) => state.global.currentPage);
  const wallets = useSelector((state: any) => state.wallets.wallets); // Get wallets from the Redux store

  // Format timestamp to DD/MM/YY | HH:MM:SS
  const formatDateTime = (timestamp: string) => {
    if (!timestamp) return "N/A"; 
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    return new Intl.DateTimeFormat('en-GB', options).format(date).replace(',', ' |');
  };

  if (currentPage === 'Records') {
    return (
      <div className='records'>
        <RecordItem 
          data={{
            id: '3',
            title: '02/04/2025',
            value: 'P13,000',
            description: 'To work',
          }} 
        />
        <RecordItem 
          data={{
            id: '2',
            title: '01/02/2025',
            value: 'P11,000',
            description: 'At home',
          }} 
        />
        <RecordItem 
          data={{
            id: '1',
            title: '31/03/2025',
            value: 'P10,000',
            description: 'To BGC',
          }} 
        />
      </div>
    );
  } else {
    return (
      <div className='records'>
        {wallets.map((wallet: any) => (
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
        ))}
      </div>
    );
  }
}

export default Records;