import Button from '@components/controls/Button';
import {
  FormResetTooltip,
  FormResetTooltipProps,
} from '@components/FormResetTooltip';
import { colors, shadows } from '@scripts/colors';
import { scale } from '@scripts/helpers';

export interface FormStickyProps extends FormResetTooltipProps {
  className?: string;
}

export const FormSticky = ({
  isDirty,
  isDefaultDirty,
  onDefaultReset,
  className,
}: FormStickyProps) => {
  if (!isDefaultDirty && !isDirty) return null;

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
        isDefaultDirty={isDefaultDirty}
        onDefaultReset={onDefaultReset}
      />
    </div>
  );
};
