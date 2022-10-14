import GlobalStyles from '@components/GlobalStyles';
import { useState } from 'react';
import { ReactComponent as GraphIcon } from '@icons/large/graph.svg';
import { ReactComponent as ClockIcon } from '@icons/large/clock.svg';

import Tabs from '@components/controls/Tabs';
import Periphery from '@views/Periphery';
import { useSelector } from 'react-redux';
import { RootState } from './store';

// https://redux.js.org/usage/configuring-your-store

function App() {
  const [tab, setTab] = useState(0);

  const rootState = useSelector<RootState>((state) => state);

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
          <Tabs.Tab>[Dev]</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel>
          <Periphery />
        </Tabs.Panel>
        <Tabs.Panel>Clock TODO</Tabs.Panel>
        <Tabs.Panel>
          <div css={{ position: 'relative' }}>
            <pre
              css={{
                display: 'inline-block',
              }}
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(rootState, undefined, 2),
              }}
            />
          </div>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}

export default App;
