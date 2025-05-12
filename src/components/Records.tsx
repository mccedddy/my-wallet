  import React from 'react';
  import ItemList from './ItemList';
  import { useSelector } from "react-redux";

  function Records() {
    const currentPage = useSelector((state: any) => state.global.currentPage);
    const wallets = useSelector((state: any) => state.wallets.wallets);
    const records = useSelector((state: any) => state.records.records);

    const isRecordsPage = currentPage === 'Records';

    return (
      <div className='records'>
        {isRecordsPage ? (
          records.length > 0 ? (
            records.map((record: any, index: number) => {
              // const nextTotal = index < records.length - 1 ? records[index + 1].total || 0 : 0;
              const change = index < records.length - 1
                ? (record.total || 0) - (records[index + 1].total || 0)
                : 0;

              return (
                <ItemList
                  key={record.id}
                  type="record"
                  data={record}
                  change={change}
                />
              );
            })
          ) : (
            <p>No records available.</p>
          )
        ) : (
          wallets.length > 0 ? (
            wallets.map((wallet: any) => (
              <ItemList key={wallet.id} type="wallet" data={wallet} change={0} />
            ))
          ) : (
            <p>No wallets available.</p>
          )
        )}
      </div>
    );
  }

  export default Records;
