import { CSSObject } from '@emotion/react';
import { FC, useMemo } from 'react';
import { useSelectTheme } from '../../context';

import { OptionProps } from '../../types';

import { Checkmark as DefaultCheckMark } from '../checkmark';

export const Option: FC<OptionProps> = ({
  className,
  option,
  children,
  selected = false,
  highlighted = false,
  disabled = false,
  multiple,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isMobile,
  Checkmark = DefaultCheckMark,
  innerProps,
}) => {
  const content = children || option.content || option.key;
  const { showCheckMark = true } = option;

  const { getCSS } = useSelectTheme();

  const optionCSS = useMemo<CSSObject>(
    () =>
      getCSS('option', {
        isDisabled: disabled,
        isHover: highlighted,
        isSelected: selected,
      }),
    [disabled, getCSS, highlighted, selected],
  );

  return (
    <li {...innerProps} className={className} css={optionCSS}>
      {Checkmark && showCheckMark && (
        <Checkmark
          disabled={disabled}
          selected={selected}
          multiple={multiple}
          position="before"
        />
      )}
      {content}
      {/** Workaround чтобы для клика показывать отметку справа и всегда в виде иконки */}
      {Checkmark && showCheckMark && (
        <Checkmark
          disabled={disabled}
          selected={selected}
          multiple={multiple}
          position="after"
        />
      )}
    </li>
  );
};
