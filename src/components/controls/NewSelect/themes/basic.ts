import { CSSObject } from '@emotion/react';

import { colors, shadows } from '@scripts/colors';
import { scale } from '@scripts/helpers';
import { MEDIA_QUERIES } from '@scripts/media';
import { OptionizedCSS, extractCSSOption } from '@scripts/theme';
import typography from '@scripts/typography';

import { SelectSize, SelectTheme } from '../types';

const { md, xl } = MEDIA_QUERIES;

export const basicTheme: SelectTheme = {
  arrowButton: {
    display: 'flex',
    alignItems: 'center',
  },
  closeButton: {},
  option: ({ isDisabled, isHover, isSelected, size = 'md' }) => {
    const sized: OptionizedCSS<typeof SelectSize> = {
      sm: {
        ...typography('paragraphExtraSmall'),
        padding: `${scale(1)}px ${scale(3, true)}px`,
      },
      md: {
        ...typography('paragraphSmall'),
        padding: `${scale(3, true)}px ${scale(2)}px`,
      },
      lg: {
        ...typography('paragraphMedium'),
        padding: `${scale(3, true)}px ${scale(2)}px`,
      },
    };
    return {
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      ...extractCSSOption(sized, size),
      ...(isHover && {
        background: colors.invertedHover,
        color: colors.backgroundDark,
      }),
      ...(isSelected && {
        background: colors.black,
        color: colors.grey100,
        ...(isHover && {
          color: colors.blue,
        }),
      }),
      ...(isDisabled && {
        background: colors.grey400,
      }),
      border: 'none',
    };
  },
  optionList: {
    overflow: 'hidden',
    borderRadius: 14,
    boxShadow: shadows.tabbarShadow,
    background: colors.white,
  },
  optgroup: {
    flexGrow: 1,
    position: 'relative',
    overflow: 'hidden',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
  },
  field: ({ disabled }) => ({
    ...typography('paragraphSmall'),
    flexGrow: 1,
    position: 'relative',
    overflow: 'hidden',
    textAlign: 'left',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
  }),
};
