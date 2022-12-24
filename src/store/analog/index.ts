import { combineReducers } from '@reduxjs/toolkit';
import { adcSlice } from './adc';

const analogReducer = combineReducers({
  adc: adcSlice.reducer,
});

export default analogReducer;
