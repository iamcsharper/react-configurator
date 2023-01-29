import { IconDefinition, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { SVGRIcon } from '@customTypes/index';

import Tooltip from '@components/controls/Tooltip';

import { colors } from '@scripts/colors';

export const DetailsTrigger = ({
  title,
  description,
  Icon = faCircleInfo,
}: {
  title: string;
  description: string;
  Icon?: SVGRIcon | IconDefinition;
}) => (
  // const { currentData, setCurrentData, enabled } = useDetails();
  // const isActive = currentData?.id === id;

  <Tooltip
    trigger="click"
    content={
      <div>
        <h4>{title}</h4>
        {description}
      </div>
    }
    hideOnClick
    interactive={false}
  >
    <button
      type="button"
      css={{
        fill: colors.blue,
        color: colors.blue,
        ':hover': {
          opacity: 0.7,
        },
      }}
      onFocus={e => {
        e.stopPropagation();
      }}
    >
      {typeof Icon === 'function' ? <Icon /> : <FontAwesomeIcon icon={Icon} />}
    </button>
  </Tooltip>
);
