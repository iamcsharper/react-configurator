import { useCallback } from 'react';

import Checkbox, { CheckboxProps } from '@components/controls/Checkbox';

import { CheckmarkProps } from '../../types';

export const Checkmark = ({
  selected,
  disabled = false,
  className,
  multiple,
  position = 'before',
  checkboxCSS,
}: CheckmarkProps) => {
  const single = !multiple || position === 'after';

  const handleCheckboxClick = useCallback<Required<CheckboxProps>['onClick']>(
    (event) => event.stopPropagation(),
    [],
  );

  if (single) return null;

  return (
    <Checkbox
      className={className}
      checked={selected}
      disabled={disabled}
      onClick={handleCheckboxClick}
      onChange={handleCheckboxClick}
      css={checkboxCSS}
    />
  );
};
