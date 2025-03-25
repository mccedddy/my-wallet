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
        <label>
          Date:
        </label>
        <DatePicker selected={startDate} className='date-picker' onChange={(date: Date | null) => setStartDate(date)} />
        <label>
          -
        </label>
        <DatePicker selected={endDate} className='date-picker' onChange={(date: Date | null) => setEndDate(date)} />
      </div>

      <RecordItem />
      <RecordItem />
      <RecordItem />
    </div>
  );
}

export default Records;
