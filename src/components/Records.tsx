import React, { useState } from 'react';
import RecordItem from './RecordItem';

interface RecordsProps {
  currentPage: string;
}

function Records({ currentPage }: RecordsProps) {
  if (currentPage === 'Records') {
    return (
      <div className='records'>
        <RecordItem type='record' />
        <RecordItem type='record' />
        <RecordItem type='record' />
        <RecordItem type='record' />
        <RecordItem type='record' />
        <RecordItem type='record' />
        <RecordItem type='record' />
      </div>
    );
  } else {
    return (
      <div className='records'>
        <RecordItem type='wallet' />
        <RecordItem type='wallet' />
        <RecordItem type='wallet' />
        <RecordItem type='wallet' />
        <RecordItem type='wallet' />
      </div>
    );
  }
}

export default Records;
