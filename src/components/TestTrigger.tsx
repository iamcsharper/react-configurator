import { useDetails } from "@context/details";
import { colors } from "@scripts/colors";
import { scale } from "@scripts/helpers";

export const TestTrigger = ({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description: string;
}) => {
  const { currentData, setCurrentData } = useDetails();
  const isActive = currentData?.id === id;

  return (
    <div
      onClick={() =>
        setCurrentData({
          id,
          title,
          description,
        })
      }
      css={{
        cursor: "pointer",
        padding: scale(2),
        background: colors.grey200,
        ...(isActive && {
          background: colors.green,
        }),

        ":hover": {
          ...(!isActive && {
            background: colors.backgroundBlue,
          }),
        },
      }}
    >
      First item
    </div>
  );
};
