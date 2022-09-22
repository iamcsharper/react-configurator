import { colors } from '@scripts/colors';
import { scale } from '@scripts/helpers';
import typography from '@scripts/typography';
import { AccordionTheme } from './types';

enum Themes {
  basic = 'basic',
}

export const themes: Record<keyof typeof Themes, AccordionTheme> = {
  basic: {
    root: {
      width: '100%',
    },
    button: (state) => ({
      userSelect: 'none',
      '.js-focus-visible &.focus-visible:focus': {
        zIndex: 1,
      },
      // TODO: state.transitionTime
      transition:
        'color ease 200ms, background-color ease 200ms, box-shadow ease 200ms',
      position: 'relative',
      cursor: 'pointer',
      // ...typography('h6'),
      ...typography('labelSmall'),
      ...(state.variant === 'primary' && {
        backgroundColor: 'transparent',
        color: colors.link,
        fill: colors.link,
        textTransform: 'uppercase',
      }),
      ...(state.variant === 'dark' && {
        backgroundColor: 'transparent',
        color: colors.white,
        fill: colors.white,
        textTransform: 'uppercase',
      }),

      svg: {
        position: 'absolute',
        top: '50%',
        right: 0,
        transform: 'translateY(-50%)',
        transition: 'transform ease 300ms, fill ease 300ms',
      },

      '&[aria-expanded="true"]': {
        ...(state.variant === 'dark' && {
          color: colors.primary,
        }),
        svg: {
          ...(state.isIconVertical
            ? {
                transform: 'translateY(-50%) rotate(180deg)',
              }
            : {
                transform: 'translateY(-50%) rotate(90deg)',
              }),
        },
      },
    }),
    heading: {
      padding: `${scale(1)}px 0`,
    },
    item: () => ({
      ':not(:last-of-type)': {
        marginBottom: scale(1),
      },
    }),
    panel: ({ panelNoPadding }) => ({
      paddingTop: scale(1),
      ...(!panelNoPadding && {
        padding: scale(2),
      }),
    }),
  },
};
