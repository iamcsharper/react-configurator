import { CSSObject } from '@emotion/react';
import { colors } from '@scripts/colors';
import { scale } from '@scripts/helpers';
import typography, { TypographyName } from '@scripts/typography';
import deepmerge from 'deepmerge';
import { ButtonTheme } from './types';

enum Themes {
  basic = 'basic',
}

export const themes: Record<keyof typeof Themes, ButtonTheme> = {
  basic: {
    button: (state) => {
      let padding = `${scale(2)}px`;
      let font: TypographyName = 'labelSmall';
      let height = scale(5);
      let borderRadius = 12;

      switch (state.size) {
        case 'md':
          padding = `${scale(3, true)}px 18px`;
          font = 'labelMedium';
          height = scale(6);
          borderRadius = 16;
          break;
        case 'lg':
          padding = `${scale(4, true)}px ${scale(5, true)}px`;
          font = 'labelLarge';
          height = scale(7);
          borderRadius = 18;
          break;
        case 'sm':
        default:
          break;
      }

      const base: CSSObject = {
        display: 'inline-flex',
        width: 'fit-content',
        justifyContent: 'center',
        alignItems: 'center',
        ...typography(font),
        padding,
        height,
        ...(state.rounded && {
          borderRadius,
        }),

        ...(state.block && {
          display: 'block',
          width: '100%',
        }),

        ':disabled': {
          cursor: 'not-allowed',
        },

        ':focus': {
          outline: 'solid dotted',
        },
      };

      return deepmerge.all([
        base,
        {
          border: '1px solid',

          borderColor: 'transparent',
          background: colors.primary,
          color: colors.black,
          ':hover': {
            background: colors.primaryHover,
          },
          ':active': {
            background: colors.primaryPressed,
          },
          ':disabled': {
            background: colors.grey400,
          },
        },
      ]) as CSSObject;
    },
    icon: (state) => {
      const marginRule = `margin${!state.iconAfter ? 'Right' : 'Left'}`;
      const invMarginRule = `margin${state.iconAfter ? 'Right' : 'Left'}`;
      const iconCSS = {
        [marginRule]: !state.hidden
          ? (state.hasChildren ? 1 : -1) * scale(1, true)
          : undefined,
        [invMarginRule]: !state.hidden ? -scale(1, true) : undefined,
        width: scale(3, true),
        height: scale(3, true),
      };

      switch (state.size) {
        case 'md':
          iconCSS.width = scale(4, true);
          iconCSS.height = scale(4, true);
          break;
        case 'lg':
          iconCSS.width = scale(5, true);
          iconCSS.height = scale(5, true);
          break;
        case 'sm':
        default:
          break;
      }

      return { ...iconCSS, fill: 'currentcolor' };
    },
  },
};
