import Button from '@components/controls/Button';
import {
  FormResetTooltip,
  FormResetTooltipProps,
} from '@components/FormResetTooltip';
import { colors, shadows } from '@scripts/colors';
import { scale } from '@scripts/helpers';
import { useFormState } from 'react-hook-form';

export type FormStickyProps = {
  className?: string;
} & Pick<FormResetTooltipProps, 'onDefaultReset'>;

export const FormSticky = ({ onDefaultReset, className }: FormStickyProps) => {
  const { isDirty } = useFormState();

  return (
    <div
      css={{
        position: 'sticky',
        bottom: 0,
        background: colors.white,
        paddingTop: scale(2),
        paddingBottom: scale(2),
        display: 'flex',
        gap: scale(2),
        boxShadow: shadows.newSliderItemShadow,
      }}
      className={className}
    >
      {isDirty && (
        <Button size="sm" type="submit">
          Сохранить
        </Button>
      )}
      <FormResetTooltip
        isDirty={isDirty}
        isDefaultDirty={isDirty}
        onDefaultReset={onDefaultReset}
      />
    </div>
  );
};
