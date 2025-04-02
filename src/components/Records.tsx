import React, { useState } from 'react';
import RecordItem from './RecordItem';
import { useSelector, useDispatch } from "react-redux";

function Records() {
  const currentPage = useSelector((state: any) => state.global.currentPage);

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
        <RecordItem
          data={{
            id: '3',
            title: 'Wallet 3',
            value: 'P11,000',
            color: '#FFFFFF',
            order: 1,
            description: 'Last Updated: 31/03/2025',
          }}
        />
        <RecordItem
          data={{
            id: '2',
            title: 'Wallet 2',
            value: 'P1,000',
            color: '#FFFFFF',
            order:2,
            description: 'Last Updated: 31/03/2025',
          }}
        />
        <RecordItem
          data={{
            id: '1',
            title: 'Wallet 1',
            value: 'P130,000',
            color: '#FFFFFF',
            order: 3,
            description: 'Last Updated: 31/03/2025',
          }}
        />
      </div>
    );
  }
}

export default Records;
