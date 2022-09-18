import { useDetails } from '@context/details';
import { colors } from '@scripts/colors';
import { scale } from '@scripts/helpers';
import { ReactNode } from 'react';

export const DetailedItemWrapper = ({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: ReactNode | ReactNode[];
}) => {
  const { currentData, setCurrentData, enabled } = useDetails();
  const isActive = currentData?.id === id;

  return (
    <div
      onClick={
        enabled
          ? () =>
              setCurrentData({
                id,
                title,
                description,
              })
          : undefined
      }
      css={{
        padding: scale(2),
        border: '1px solid',
        borderColor: colors.grey200,
        ...(enabled && {
          cursor: 'pointer',
          ...(isActive && {
            borderColor: colors.green,
          }),
          ':hover': {
            ...(!isActive && {
              borderColor: colors.backgroundBlue,
            }),
          },
        }),
      }}
    >
      {children}
    </div>
  );
};
