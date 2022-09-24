import GlobalStyles from '@components/GlobalStyles';
import { useState } from 'react';
import { ReactComponent as GraphIcon } from '@icons/large/graph.svg';
import { ReactComponent as ClockIcon } from '@icons/large/clock.svg';
import Periphery from './views/Periphery';
import Tabs from './components/controls/Tabs';

// https://redux.js.org/usage/configuring-your-store

function App() {
  const [tab, setTab] = useState(0);

  return (
    <>
      <GlobalStyles />
      <Tabs
        selectedIndex={tab}
        onSelect={(index) => setTab(index)}
        css={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        panelFillsHeight
      >
        <Tabs.List horizontalScroll>
          <Tabs.Tab Icon={GraphIcon}>Периферия</Tabs.Tab>
          <Tabs.Tab Icon={ClockIcon}>Clock</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel>
          <Periphery />
        </Tabs.Panel>
        <Tabs.Panel>123123</Tabs.Panel>
      </Tabs>
    </>
  );
}

export default App;
