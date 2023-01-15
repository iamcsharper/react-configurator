import { combineReducers } from '@reduxjs/toolkit';

import { crcSlice } from './crc';

const cryptoReducer = combineReducers({
  crc: crcSlice.reducer,
});

export default cryptoReducer;
