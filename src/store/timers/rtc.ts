import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { z } from 'zod';
import { toZod } from 'tozod';
import { zodStringToNumber } from '@scripts/helpers';

export enum RtcSourceType {
  External = 1,
  Internal = 2,
}

export interface RtcTimeDate {
  year: number;
  month: number;
  day: number;
  weekDay: number;

  hours: number;
  minutes: number;
  seconds: number;
}

export const rtcDateTimeSchema = z
  .object({
    year: z.number({ invalid_type_error: 'Год обязательное поле' }),
    month: z.number({ invalid_type_error: 'Месяц обязательное поле' }),
    day: z.number({ invalid_type_error: 'Число обязательное поле' }),
    weekDay: z.number({ invalid_type_error: 'Несуществующая дата' }),

    hours: z.number({ invalid_type_error: 'Часы обязательное поле' }),
    minutes: z.number({ invalid_type_error: 'Минуты обязательное поле' }),
    seconds: z.number({ invalid_type_error: 'Секунды обязательное поле' }),
  })
  .superRefine((arg, ctx) => {
    const { day, month, year } = arg;

    const dateStr = `${Number(month) + 1}-${day}-${year}`;
    const tryDate = new Date(dateStr);

    if (tryDate.getMonth() !== month) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_date,
        message: 'Дата не существует',
        fatal: true,
        path: [],
      });
    }
  }) as never as toZod<RtcTimeDate>;

export interface RtcState {
  rtcEnabled: boolean;
  alarmEnabled: boolean;

  rtcSource: RtcSourceType;
  rtcDateTime: RtcTimeDate;
  rtcRegisters: number[];

  // TODO: alarm date and time?
}

export const rtcStateSchema: toZod<Omit<RtcState, 'rtcSource'>> = z.object({
  alarmEnabled: z.boolean(),
  rtcEnabled: z.boolean(),
  rtcSource: z.nativeEnum(RtcSourceType),
  rtcDateTime: rtcDateTimeSchema,
  rtcRegisters: z
    .number({ invalid_type_error: 'Необходимо число, а не строка' })
    .array()
    .length(16),
});

export const rtcRegisterSchema = zodStringToNumber(
  z
    .number()
    .min(0, 'Число должно быть больше 0')
    .max(2 ** 32 - 1, 'Число должно быть менее 2 ^ 32 - 1\n(4 294 967 295)'),
);

const initialState: RtcState = {
  alarmEnabled: false,
  rtcDateTime: {
    day: null as never as number,
    month: null as never as number,
    year: null as never as number,
    weekDay: null as never as number,
    hours: null as never as number,
    minutes: null as never as number,
    seconds: null as never as number,
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
    setRtcDateTime: (state, action: PayloadAction<RtcTimeDate>) => {
      state.rtcDateTime = action.payload;
    },
    setRtcSource: (state, action: PayloadAction<RtcSourceType>) => {
      state.rtcSource = action.payload;
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
  setRtcDateTime,
  setRtcSource,
  setRtcRegisters,
  setRtcRegister,
} = rtcSlice.actions;
