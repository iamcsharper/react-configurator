import { colors } from '@scripts/colors';
import { scale } from '@scripts/helpers';
import { ReactNode } from 'react';

export interface PinProps {
  name: string;
  isActive: boolean;
  children?: ReactNode | ReactNode[];
  onClick?: () => void;
}

// TODO
const Pin = ({ name, isActive, children, onClick }: PinProps) => (
  <div
    css={{
      position: 'relative',
      width: '100%',
    }}
  >
    <button
      type="button"
      css={{
        width: '100%',
        height: scale(2),
        cursor: 'pointer',
        padding: `${scale(1, true)}px ${scale(1)}px`,
        ...(isActive && {
          background: colors.primary,
          color: colors.black,
        }),
      }}
      onClick={onClick}
    >
      <span>{name}</span>
      {children}
    </button>
  </div>
);

export default Pin;
