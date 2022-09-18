import Sidebar from "@components/Sidebar";
import { colors } from "@scripts/colors";
import { scale } from "@scripts/helpers";
import { useMemo } from "react";
import { useLocation, useMatch, Link } from "react-router-dom";

interface LinkData {
  label: string;
  link: string;
}

interface LinkGroup {
  label: string;
  links: LinkData[];
}

const items: LinkGroup[] = [
  {
    label: "Система",
    links: [
      {
        label: "Монитор питания",
        link: "#",
      },
      {
        label: "Монитор тактирования",
        link: "#",
      },
      {
        label: "ПДП",
        link: "#",
      },
      {
        label: "Тактирование",
        link: "#",
      },
      {
        label: "Прерывания",
        link: "#",
      },
      {
        label: "GPIO",
        link: "#",
      },
      {
        label: "WDT",
        link: "#",
      },
      {
        label: "Bus' WDT",
        link: "#",
      },
    ],
  },
  {
    label: "Аналоговые блоки",
    links: [
      {
        label: "АЦП",
        link: "#",
      },
      {
        label: "Температурный сенсор",
        link: "#",
      },
      {
        label: "ЦАП",
        link: "#",
      },
    ],
  },
  {
    label: "Таймеры",
    links: [
      {
        label: "RTC",
        link: "/rtc",
      },
      {
        label: "TIMER32",
        link: "/timer32",
      },
      {
        label: "TIMER16",
        link: "/timer16",
      },
    ],
  },
  {
    label: "Интерфейсы",
    links: [
      {
        label: "I2C",
        link: "#",
      },
      {
        label: "SPI",
        link: "#",
      },
      {
        label: "SPIFI",
        link: "#",
      },
      {
        label: "USART",
        link: "#",
      },
    ],
  },
  {
    label: "Криптография",
    links: [
      {
        label: "Крипто-блок",
        link: "#",
      },
      {
        label: "CRC",
        link: "#",
      },
    ],
  },
];

const NavLink = ({ link, label }: LinkData) => {
  const match = useMatch(`${link}/*`);

  return (
    <Link
      to={link}
      css={{
        color: colors.link,
        textDecoration: "none",
        padding: scale(1),
        background: colors.grey100,
        borderLeft: `${scale(1, true)}px solid ${colors.grey200}`,
        ...(match && {
          borderLeftColor: colors.link,
          background: colors.link,
          color: colors.white,
          cursor: "default",
        }),
        ...(!match && {
          ":hover": {
            borderLeft: `${scale(1, true)}px solid ${colors.link}`,
            background: colors.grey300,
          },
        }),
      }}
    >
      {label}
    </Link>
  );
};

const SidebarContainer = () => {
  const { pathname } = useLocation();

  const activeGroupId = useMemo<string>(() => {
    let groupIndex = 0;

    for (let i = 0; i < items.length; i += 1) {
      const groupItems = items[i].links;

      if (groupItems.map((e) => e.link).includes(pathname)) {
        groupIndex = i;
        break;
      }
    }
    return `${groupIndex}`;
  }, [pathname]);

  return (
    <Sidebar title="Список перифирий">
      <Sidebar.Nav
        preExpanded={[activeGroupId]}
        animationType="fadeIn"
        allowMultipleExpanded={false}
      >
        {items &&
          items.map((group, index) => (
            <Sidebar.Group id={`${index}`} key={index} title={group.label}>
              <div
                css={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: scale(1),
                }}
              >
                {/* const match = useMatch(`${path}/*`); */}
                {group.links.map((link, index) => (
                  <NavLink {...link} key={index} />
                ))}
              </div>
            </Sidebar.Group>
          ))}
      </Sidebar.Nav>
    </Sidebar>
  );
};

export default SidebarContainer;
