import React, { useState } from 'react';
import RecordItem from './RecordItem';

function Records() {
  return (
    <div className='records'>
      <RecordItem />
      <RecordItem />
      <RecordItem />
    </div>
  );
}

export default Records;
