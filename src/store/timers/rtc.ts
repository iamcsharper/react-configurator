import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { z } from 'zod';
import { toZod } from 'tozod';

export enum RtcSourceType {
  External = 1,
  Internal = 2,
}

export interface RtcDate {
  century: number | null;
  year: number | null;
  month: number | null;
  day: number | null;
}

export const rtcDateSchema: toZod<RtcDate> = z.object({
  century: z.nullable(z.number()),
  year: z.nullable(z.number()),
  month: z.nullable(z.number()),
  day: z.nullable(z.number()),
});

export interface RtcTime {
  hours: number | null;
  minutes: number | null;
  seconds: number | null;
}

export const rtcTimeSchema: toZod<RtcTime> = z.object({
  hours: z.nullable(z.number()),
  minutes: z.nullable(z.number()),
  seconds: z.nullable(z.number()),
});

export interface RtcState {
  rtcEnabled: boolean;
  alarmEnabled: boolean;

  rtcSource: RtcSourceType;
  rtcDate: RtcDate;
  rtcTime: RtcTime;
  rtcRegisters: number[];

  // TODO: alarm date and time?
}

export const rtcStateSchema: toZod<Omit<RtcState, 'rtcSource'>> = z.object({
  alarmEnabled: z.boolean(),
  rtcEnabled: z.boolean(),
  rtcSource: z.nativeEnum(RtcSourceType),
  rtcDate: rtcDateSchema,
  rtcTime: rtcTimeSchema,
  rtcRegisters: z
    .number({ invalid_type_error: 'Необходимо число, а не строка' })
    .array()
    .length(16),
});

const initialState: RtcState = {
  alarmEnabled: false,
  rtcDate: {
    century: null,
    day: null,
    month: null,
    year: null,
  },
  rtcTime: {
    hours: null,
    minutes: null,
    seconds: null,
  },
  rtcEnabled: false,
  rtcRegisters: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  rtcSource: RtcSourceType.Internal,
};

export const rtcSlice = createSlice({
  name: 'rtc',
  initialState,
  reducers: {
    setRtc: (_, action: PayloadAction<RtcState>) => ({ ...action.payload }),
    setAlarmEnabled: (state, action: PayloadAction<boolean>) => {
      state.alarmEnabled = action.payload;
    },
    setRtcEnabled: (state, action: PayloadAction<boolean>) => {
      state.rtcEnabled = action.payload;

      if (!state.rtcEnabled) {
        state.alarmEnabled = false;
      }
    },
    setRtcDate: (state, action: PayloadAction<RtcDate>) => {
      state.rtcDate = action.payload;
    },
    setRtcSource: (state, action: PayloadAction<RtcSourceType>) => {
      state.rtcSource = action.payload;
    },
    setRtcTime: (state, action: PayloadAction<RtcTime>) => {
      state.rtcTime = action.payload;
    },
    setRtcRegisters: (
      state,
      action: PayloadAction<RtcState['rtcRegisters']>,
    ) => {
      state.rtcRegisters = action.payload;
    },
    setRtcRegister: (
      state,
      action: PayloadAction<{ index: number; value: number }>,
    ) => {
      state.rtcRegisters[action.payload.index] = action.payload.value;
      state.rtcRegisters = [...state.rtcRegisters] as any;
    },
  },
});

export const {
  setRtc,
  setAlarmEnabled,
  setRtcEnabled,
  setRtcDate,
  setRtcSource,
  setRtcTime,
  setRtcRegisters,
  setRtcRegister,
} = rtcSlice.actions;
