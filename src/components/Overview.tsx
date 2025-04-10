import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { supabase } from '../services/supabaseClient';

function Overview() {
  const records = useSelector((state: any) => state.records.records);
  const wallets = useSelector((state: any) => state.wallets.wallets); 
  const [walletValues, setWalletValues] = useState<{ id: string; name: string; color: string; value: number }[]>([]);
  const [total, setTotal] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    const fetchLatestWalletValues = async () => {
      if (records.length === 0) {
        console.error('No records found.');
        return;
      }

      // Get the latest record
      const latestRecord = records[0]; 
			setLastUpdated(new Date(latestRecord.created_at).toLocaleDateString('en-US'));

      // Fetch wallet values for the latest record
      const { data: walletValuesData, error } = await supabase
        .from('wallet_values')
        .select('wallet_id, value')
        .eq('record_id', latestRecord.id);

      if (error) {
        console.error('Error fetching wallet values:', error.message);
        return;
      }

      // Map wallet values to include wallet details (name and color)
      const updatedWalletValues = wallets.map((wallet: any) => {
        const walletValue = walletValuesData.find((wv: any) => wv.wallet_id === wallet.id)?.value || 0;
        return {
          id: wallet.id,
          name: wallet.name,
          color: wallet.color,
          value: walletValue,
        };
      });

      setWalletValues(updatedWalletValues);

      // Calculate the total value
      const totalValue = updatedWalletValues.reduce((sum: any, wallet: any) => sum + wallet.value, 0);
      setTotal(totalValue);
    };

    fetchLatestWalletValues();
  }, [records, wallets]);

  return (
    <div className='overview'>
      <div className='overview-total'>
        <h2 className='bold'>Total</h2>
        <h2 className='bold'>₱ {total.toLocaleString()}</h2>
      </div>
      <div className='overview-wallets'>
        {walletValues.map((wallet) => (
          <div key={wallet.id} className='wallet'>
            <p style={{ color: wallet.color }}>{wallet.name}</p>
            <p>₱ {wallet.value.toLocaleString()}</p>
          </div>
        ))}
      </div>
      <p>Last Updated: {lastUpdated}</p>
    </div>
  );
}

export default Overview;