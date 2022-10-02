import { CSSObject } from '@emotion/react';
import { colors, shadows } from '@scripts/colors';
import { rgba, scale } from '@scripts/helpers';
import typography from '@scripts/typography';
import { SelectTheme } from './types';

enum Themes {
  basic = 'basic',
}

export const themes: Record<keyof typeof Themes, SelectTheme> = {
  basic: {
    field: (state) => ({
      display: 'flex',
      alignItems: 'center',
      paddingRight: `${scale(4)}px !important`,
      ...(state.isOneLine && {
        display: 'block',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textAlign: 'left',
      }),
      ...(state.isOpen && {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      }),

      ...(state.variant === 'dark' && {
        background: colors.black,
        color: colors.white,

        ...(state.isFocused && {
          borderColor: '#000',
        }),
      }),
    }),
    optionList: (state) => ({
      position: 'absolute',
      left: 0,
      right: 0,
      overflowY: 'auto',
      zIndex: 100,
      // ':focus': { outlineOffset: -2 },

      '::-webkit-scrollbar-thumb': {
        backgroundColor: colors.grey400,
        borderRadius: scale(4),
      },
      '::-webkit-scrollbar': {
        maxWidth: 6,
      },

      '::-webkit-scrollbar-track': {
        backgroundColor: colors.grey100,
        borderRadius: scale(4),
      },

      ...(state.size === 'md' && {
        borderRadius: scale(3, true),
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        maxHeight: 200,
        '::-webkit-scrollbar-track': {
          margin: `${scale(3, true)}px 0`,
        },
      }),

      boxShadow: shadows.small,
      ...(state.variant === 'dark' && {
        background: colors.black,
      }),
      ...(state.variant === 'primary' && {
        background: colors.white,
      }),
    }),
    arrowButton: (state) => ({
      position: 'absolute',
      top: 0,
      right: 0,
      display: 'grid',
      alignContent: 'center',
      height: '100%',

      ':disabled': {
        cursor: 'not-allowed',
      },

      // pointerEvents: state.isSearch ? 'none' : 'all',

      ...(state.size === 'md' && {
        padding: `0 ${scale(3, true)}px`,
      }),

      svg: {
        ...(state.variant === 'dark' && {
          fill: colors.white,
        }),
        transition: 'transform ease 300ms',
        ...(!state.isOpen && { transform: 'rotate(180deg)' }),
      },
    }),
    closeButton: (state) => ({
      position: 'absolute',
      top: 0,
      right: 24,
      display: 'grid',
      alignContent: 'center',
      height: '100%',
      ...(!state.hasSelected && { display: 'none' }),
      ':disabled': {
        cursor: 'not-allowed',
      },

      ...(state.size === 'md' && {
        padding: `0 ${scale(3, true)}px`,
      }),

      svg: {
        ...(state.variant === 'dark' && {
          fill: colors.white,
        }),
      },
    }),
    legend: {},
    option: (state) => {
      const highlight: CSSObject = {
        ...(state.variant === 'dark' && {
          background: rgba(colors.white, 0.2),
          color: colors.white,
        }),
        ...(state.variant === 'primary' && {
          background: 'lightgrey',
          color: 'black',
        }),
      };

      const selected: CSSObject = {
        ...(state.variant === 'dark' && {
          background: colors.primary,
          color: colors.black,
        }),
        ...(state.variant === 'primary' && {
          background: colors.black,
          color: colors.white,
        }),
      };
      return {
        width: '100%',
        ...(state.size === 'md' && {
          padding: `${scale(1)}px ${scale(2)}px`,
          ...typography('paragraphSmall'),
        }),

        cursor: 'pointer',
        ...(state.isDisabled && { cursor: 'not-allowed' }),

        ...(state.variant === 'dark' && {
          background: colors.black,
          color: colors.white,
        }),
        ...(state.isHover && highlight),
        ...(state.isSelected && selected),
        '&:hover:focus:not(:disabled)': highlight,
      };
    },
  },
};
