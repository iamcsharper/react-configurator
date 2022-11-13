// import DetailsPane from '@components/DetailsPane';
import Timers from '@containers/utility/Periphery/Timers';
import { DetailsProvider, useDetails } from '@context/details';
import { Allotment, AllotmentHandle } from 'allotment';
import { useEffect, useRef } from 'react';

import { Route, Routes, useParams } from 'react-router-dom';

const SplitPanes = () => {
  const props = useParams();
  const { setCurrentData } = useDetails();

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
    <Allotment vertical ref={ref}>
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
      {/* <Allotment.Pane maxSize={150} snap>
        <DetailsPane />
      </Allotment.Pane> */}
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
