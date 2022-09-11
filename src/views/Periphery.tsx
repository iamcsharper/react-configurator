import Accordion from "@components/controls/Accordion";
import { colors } from "@scripts/colors";
import { scale } from "@scripts/helpers";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { useMemo } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Link,
  useMatch,
  useLocation,
} from "react-router-dom";
import PeripheryPage from "./[Periphery]";

// TODO: https://github.com/remix-run/react-router/blob/main/docs/getting-started/tutorial.md

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
          background: colors.link,
          color: colors.white,
          cursor: 'default',
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

const Sidebar = () => {
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
    <div
      css={{
        maxHeight: "100%",
        overflow: "hidden",
        overflowY: "auto",
        padding: scale(2),
      }}
    >
      <h4 css={{ marginBottom: scale(2) }}>Список перифирий</h4>
      <Accordion
        preExpanded={[activeGroupId]}
        animationType="fadeIn"
        allowMultipleExpanded={false}
      >
        {items &&
          items.map((group, index) => (
            <Accordion.Item uuid={`${index}`} key={index}>
              <Accordion.Heading css={{ padding: 0 }}>
                <Accordion.Button>{group.label}</Accordion.Button>
              </Accordion.Heading>
              <Accordion.Panel>
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
              </Accordion.Panel>
            </Accordion.Item>
          ))}
      </Accordion>
    </div>
  );
};

const Periphery = () => (
  <BrowserRouter>
    <Allotment>
      <Allotment.Pane minSize={200} preferredSize={200}>
        <Sidebar />
      </Allotment.Pane>
      <Allotment.Pane>
        <Routes>
          <Route path="/">
            <Route path=":id" element={<PeripheryPage />} />
          </Route>
        </Routes>
      </Allotment.Pane>
      <Allotment.Pane>
        <div
          css={{
            background: colors.grey300,
            height: "100%",
            width: "100%",
          }}
        />
      </Allotment.Pane>
    </Allotment>
  </BrowserRouter>
);

export default Periphery;
