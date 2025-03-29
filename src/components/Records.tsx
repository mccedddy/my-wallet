import React, { useState } from 'react';
import RecordItem from './RecordItem';
import { useSelector, useDispatch } from "react-redux";

function Records() {
  const dispatch = useDispatch();
  const currentPage = useSelector((state: any) => state.global.currentPage);

  if (currentPage === 'Records') {
    return (
      <div className='records'>
        <RecordItem />
        <RecordItem />
        <RecordItem />
      </div>
    );
  } else {
    return null;
  }
}

export default Records;
