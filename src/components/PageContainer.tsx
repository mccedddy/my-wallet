import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Records from './Records'

function PageContainer() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  return (
    <div className='page-container'>
      <h3 className='page-text'>Records</h3>
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
      <Records />
    </div>
  );
}

export default PageContainer;
