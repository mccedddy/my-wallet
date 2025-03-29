import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Records from './Records'
import { useSelector, useDispatch } from "react-redux";
import { toggleOverview, setStartDate, setEndDate } from "../reducers/globalSlice";

function PageContainer() {
  const dispatch = useDispatch();
  const currentPage = useSelector((state: any) => state.global.currentPage);
  const filterShown = useSelector((state: any) => state.global.filterShown);
  const startDate = useSelector((state: any) => new Date(state.global.startDate));
  const endDate = useSelector((state: any) => new Date(state.global.endDate));

  // const [startDate, setStartDate] = useState<Date | null>(new Date());
  // const [endDate, setEndDate] = useState<Date | null>(new Date());

  return (
    <div className='page-container'>
      <h3 className='page-text' onClick={() => {
        dispatch(toggleOverview())
      }}>{currentPage}</h3>

      {filterShown && 
        <div className='filter'>
          <label>
            Date:
          </label>
          <DatePicker
            selected={startDate}
            className='date-picker'
            onChange={(date: Date | null) => {
              if (date) dispatch(setStartDate(date.toISOString()));
            }}
          /><label>
            -
          </label>
          <DatePicker
            selected={endDate}
            className='date-picker'
            onChange={(date: Date | null) => {
              if (date) dispatch(setEndDate(date.toISOString()));
            }}
          />
        </div>
      }

      <Records />
    </div>
  );
}

export default PageContainer;
