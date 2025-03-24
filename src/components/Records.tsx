import React, { useState } from 'react';
import RecordItem from './RecordItem';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Records() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  return (
    <div className='records'>
      <div className='filter'>
        <label className='filter-label'>
          Date:
        </label>
        <DatePicker selected={startDate} className='date-picker' onChange={(date) => setStartDate(date)} />
        <label className='filter-label'>
          -
        </label>
        <DatePicker selected={endDate} className='date-picker' onChange={(date) => setEndDate(date)} />
      </div>

      <RecordItem />
      <RecordItem />
      <RecordItem />
    </div>
  );
}

export default Records;
