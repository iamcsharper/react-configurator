import { ReactNode } from 'react';

export interface PinColumnProps {
  children?: ReactNode | ReactNode[];
  left: number;
  top: number;
  rotation: number;
  width?: number;
}

const PinColumn = ({
  top,
  left,
  width,
  rotation,
  children,
}: PinColumnProps) => (
  <div
    css={{
      position: 'absolute',
      top,
      left,
      width,
      transform: `rotate(${rotation}deg)`,
    }}
  >
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </div>
  </div>
);

export default PinColumn;
