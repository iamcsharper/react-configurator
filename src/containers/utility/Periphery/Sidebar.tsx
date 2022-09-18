import NavLink from '@components/NavLink';
import Sidebar from '@components/Sidebar';
import { scale } from '@scripts/helpers';
import { useFieldCSS } from '@scripts/hooks/useFieldCSS';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

interface LinkData {
  label: string;
  to: string;
}

interface LinkGroup {
  label: string;
  links: LinkData[];
}

const items: LinkGroup[] = [
  {
    label: 'Система',
    links: [
      {
        label: 'Монитор питания',
        to: '/',
      },
      {
        label: 'Монитор тактирования',
        to: '/',
      },
      {
        label: 'ПДП',
        to: '/',
      },
      {
        label: 'Тактирование',
        to: '/',
      },
      {
        label: 'Прерывания',
        to: '/',
      },
      {
        label: 'GPIO',
        to: '/',
      },
      {
        label: 'WDT',
        to: '/',
      },
      {
        label: "Bus' WDT",
        to: '/',
      },
    ],
  },
  {
    label: 'Аналоговые блоки',
    links: [
      {
        label: 'АЦП',
        to: '/',
      },
      {
        label: 'Температурный сенсор',
        to: '/',
      },
      {
        label: 'ЦАП',
        to: '/',
      },
    ],
  },
  {
    label: 'Таймеры',
    links: [
      {
        label: 'RTC',
        to: '/rtc',
      },
      {
        label: 'TIMER32',
        to: '/timer32',
      },
      {
        label: 'TIMER16',
        to: '/timer16',
      },
    ],
  },
  {
    label: 'Интерфейсы',
    links: [
      {
        label: 'I2C',
        to: '/',
      },
      {
        label: 'SPI',
        to: '/',
      },
      {
        label: 'SPIFI',
        to: '/',
      },
      {
        label: 'USART',
        to: '/',
      },
    ],
  },
  {
    label: 'Криптография',
    links: [
      {
        label: 'Крипто-блок',
        to: '/',
      },
      {
        label: 'CRC',
        to: '/',
      },
    ],
  },
];

// const NavLink = ({ link, label }: LinkData) => {
//   const match = useMatch(`${link}/*`);

//   return (
//     <Link
//       to={link}
//       css={{
//         color: colors.link,
//         textDecoration: 'none',
//         padding: `${scale(1)}px ${scale(2)}px`,
//         borderRadius: scale(3, true),
//         border: `1px solid ${colors.grey200}`,
//         ...(match && {
//           borderColor: colors.link,
//           background: colors.link,
//           color: colors.white,
//           cursor: 'default',
//         }),
//         ...(!match && {
//           ':hover': {
//             border: `1px solid ${colors.link}`,
//           },
//         }),
//       }}
//     >
//       {label}
//     </Link>
//   );
// };

const SidebarContainer = ({ isDark }: { isDark: boolean }) => {
  const { pathname } = useLocation();

  const activeGroupId = useMemo<string>(() => {
    let groupIndex = 0;

    for (let i = 0; i < items.length; i += 1) {
      const groupItems = items[i].links;

      if (groupItems.map((e) => e.to).includes(pathname)) {
        groupIndex = i;
        break;
      }
    }
    return `${groupIndex}`;
  }, [pathname]);

  const { basicFieldCSS } = useFieldCSS({});
  const { register, watch } = useForm({
    defaultValues: {
      search: '',
    },
  });

  const search = watch('search');
  const filteredItems = useMemo(
    () =>
      items.filter((el) => {
        const term = search.toLowerCase();
        if (el.label.toLowerCase().includes(term)) return true;

        const concat = el.links
          .map((e) => e.label)
          .join(',')
          .toLowerCase();
        return concat.includes(term);
      }),
    [search],
  );

  return (
    <Sidebar title="Список перифирий">
      <input
        css={[basicFieldCSS, { marginBottom: scale(2) }]}
        placeholder="Поиск"
        {...register('search')}
      />
      <Sidebar.Nav
        preExpanded={[activeGroupId]}
        animationType="fadeIn"
        allowMultipleExpanded={false}
        variant={isDark ? 'dark' : 'primary'}
        isIconVertical
      >
        {filteredItems &&
          filteredItems.map((group, index) => (
            <Sidebar.Group id={`${index}`} key={index} title={group.label}>
              <div
                css={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: scale(1),
                }}
              >
                {group.links.map(({ to, label }, index) => (
                  <NavLink
                    variant={isDark ? 'dark' : 'primary'}
                    key={index}
                    to={to}
                  >
                    {label}
                  </NavLink>
                ))}
              </div>
            </Sidebar.Group>
          ))}
      </Sidebar.Nav>
    </Sidebar>
  );
};

export default SidebarContainer;
