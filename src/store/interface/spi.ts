import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { z } from 'zod';

import { OptionShape } from '@components/controls/NewSelect';

export enum TickPhase {
  ACTIVE_OUTSIDE = 'active-outside',
  INACTIVE_OUTSIDE = 'inactive-outside',
}

export const tickPhaseOptions: OptionShape[] = [
  {
    key: 'Тактовая частота активна вне слова',
    value: TickPhase.ACTIVE_OUTSIDE,
  },
  {
    key: 'Тактовая частота НЕактивна вне слова',
    value: TickPhase.INACTIVE_OUTSIDE,
  },
];

export enum TickPolarity {
  LOW = 'low',
  HIGH = 'high',
}

export const tickPolarityOptions: OptionShape[] = [
  {
    key: 'Тактовый сигнал удерживается на низком уровне',
    value: TickPolarity.LOW,
  },
  {
    key: 'Тактовый сигнал удерживается на высоком уровне',
    value: TickPolarity.HIGH,
  },
];

export enum PeripheralDecoder {
  ONE_OF_FOUR = 'one-of-four',
  EXTERNAL = 'external',
}

export const peripheralDecoderOptions: OptionShape[] = [
  {
    key: 'Выбор 1 из 4 устройств',
    value: PeripheralDecoder.ONE_OF_FOUR,
  },
  {
    key: 'Внешний декодер',
    value: PeripheralDecoder.EXTERNAL,
  },
];

export enum SlaveSignalControl {
  AUTO = 'auto',
  MANUAL = 'manual',
}

export const slaveSignalControlOptions: OptionShape[] = [
  {
    key: 'Автоматический',
    value: SlaveSignalControl.AUTO,
  },
  {
    key: 'Ручной',
    value: SlaveSignalControl.MANUAL,
  },
];

export const dividerOptions: OptionShape[] = [4, 8, 16, 32, 64, 128, 256].map(e => ({
  key: `${e}`,
  value: e,
}));

export const packageSizeOptions: OptionShape[] = [8, 16, 24, 32].map(e => ({
  key: `${e} бит`,
  value: e,
}));

export enum Slave {
  NONE = 'none',
  CS0 = 'CS0',
  CS1 = 'CS1',
  CS2 = 'CS2',
  CS3 = 'CS3',
}

export const slaveOptions: OptionShape[] = [
  {
    key: 'Не выбрано',
    value: Slave.NONE,
  },
  {
    key: 'Устройство 1',
    value: Slave.CS0,
  },
  {
    key: 'Устройство 2',
    value: Slave.CS1,
  },
  {
    key: 'Устройство 3',
    value: Slave.CS2,
  },
  {
    key: 'Устройство 4',
    value: Slave.CS3,
  },
];

export enum Mode {
  DISABLED = 'disabled',
  MASTER = 'master',
  SLAVE = 'slave',
}

export const modeOptions: OptionShape[] = [
  {
    key: 'Выключен',
    value: Mode.DISABLED,
  },
  {
    key: 'Ведущий',
    value: Mode.MASTER,
  },
  {
    key: 'Ведомый',
    value: Mode.SLAVE,
  },
];

export const spiStateSchema = z
  .object({
    // Common
    mode: z.nativeEnum(Mode, { required_error: 'Обязательное поле' }),
    divider: z.number({ required_error: 'Обязательное поле' }),
    tickPhase: z.nativeEnum(TickPhase, { required_error: 'Обязательное поле' }),
    tickPolarity: z.nativeEnum(TickPolarity, { required_error: 'Обязательное поле' }),
    packageSize: z.number({ required_error: 'Обязательное поле' }),

    // Master
    peripheralDecoder: z.nativeEnum(PeripheralDecoder, { required_error: 'Обязательное поле' }).optional(),
    slaveSignalControl: z.nativeEnum(SlaveSignalControl, { required_error: 'Обязательное поле' }).optional(),
    slave: z.nativeEnum(Slave, { required_error: 'Обязательное поле' }).optional(),
  })
  .refine(
    val => {
      const isMaster = val.mode === Mode.MASTER;
      if (!isMaster) return true;

      const isAutoSignal = val.slaveSignalControl === SlaveSignalControl.AUTO;
      if (!isAutoSignal) return true;

      return val.slave !== undefined;
    },
    {
      message: 'Обязательное поле',
      path: ['slave'],
    }
  )
  .refine(
    val => {
      const isMaster = val.mode === Mode.MASTER;
      if (!isMaster) {
        return true;
      }

      if ([val.peripheralDecoder, val.slaveSignalControl].some(e => e === undefined)) return false;

      return true;
    },
    {
      message: 'Обязательное поле',
      path: ['peripheralDecoder'],
    }
  );

export type SpiState = z.infer<typeof spiStateSchema>;

export const spiInitialState: SpiState = {
  mode: Mode.DISABLED,

  // Common
  divider: 4,
  tickPhase: TickPhase.ACTIVE_OUTSIDE,
  tickPolarity: TickPolarity.LOW,
  packageSize: 8,

  // Master
  peripheralDecoder: PeripheralDecoder.ONE_OF_FOUR,
  slaveSignalControl: SlaveSignalControl.AUTO,
  slave: Slave.NONE,
};

export const spiInitialStateMaster: Pick<SpiState, 'peripheralDecoder' | 'slaveSignalControl' | 'slave'> = {
  peripheralDecoder: PeripheralDecoder.ONE_OF_FOUR,
  slaveSignalControl: SlaveSignalControl.AUTO,
  slave: Slave.NONE,
};

export const spiSlice = createSlice({
  name: 'spi',
  initialState: spiInitialState,
  reducers: {
    setSpi: (_, action: PayloadAction<SpiState>) => ({ ...action.payload }),
  },
});

export const { setSpi } = spiSlice.actions;
