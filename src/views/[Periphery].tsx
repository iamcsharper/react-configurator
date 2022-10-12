import Timers from '@containers/utility/Periphery/Timers';
import { DetailsProvider, useDetails } from '@context/details';
import { scale } from '@scripts/helpers';
import { Allotment, AllotmentHandle } from 'allotment';
import { useEffect, useRef } from 'react';

import { Route, Routes, useParams } from 'react-router-dom';

const Details = () => {
  const { currentData /* setEnabled */ } = useDetails();

  return (
    <div css={{ padding: scale(2) }}>
      <div css={{ display: 'flex', justifyContent: 'space-between' }}>
        <h4 css={{ marginBottom: scale(1) }}>
          {currentData?.title || 'Не выбрано'}
        </h4>
        {/* <span onClick={() => setEnabled(false)}>x</span> */}
      </div>
      {currentData && <p>{currentData?.description}</p>}
    </div>
  );
};

const SplitPanes = () => {
  const props = useParams();
  const { setCurrentData, setEnabled } = useDetails();

  useEffect(() => {
    setCurrentData(null);

    return () => setCurrentData(null);
  }, [props, setCurrentData]);

  const ref = useRef<AllotmentHandle>(null);

  useEffect(() => {
    const handle = ref.current;

    const onresize = () => {
      handle?.reset();
    };

    window.addEventListener('resize', onresize);

    return () => {
      window.removeEventListener('resize', onresize);
    };
  }, []);

  return (
    <Allotment
      vertical
      onChange={(sizes) => {
        const isDetailsVisible = !!sizes[1];
        setEnabled(isDetailsVisible);
      }}
      ref={ref}
    >
      <Allotment.Pane>
        <div
          css={{
            height: '100%',
            overflow: 'hidden',
            overflowY: 'scroll',
            // paddingBottom: scale(40),
          }}
        >
          <Routes>
            <Route path="timers/*" element={<Timers />} />
            <Route path="*" element={<p>Work in progress</p>} />
          </Routes>
        </div>
      </Allotment.Pane>
      <Allotment.Pane maxSize={150} snap>
        <Details />
      </Allotment.Pane>
    </Allotment>
  );
};

export default function PeripheryPage() {
  return (
    <DetailsProvider>
      <SplitPanes />
    </DetailsProvider>
  );
}
