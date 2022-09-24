import Timers from '@containers/utility/Periphery/Timers';
import { DetailsProvider, useDetails } from '@context/details';
import { scale } from '@scripts/helpers';
import { Allotment, AllotmentHandle } from 'allotment';
import { useEffect, useRef } from 'react';

import { Route, Routes, useParams } from 'react-router-dom';

const Details = () => {
  const { currentData } = useDetails();

  return (
    <div css={{ padding: scale(2) }}>
      {currentData ? (
        <>
          <h4 css={{ marginBottom: scale(1) }}>{currentData?.title}</h4>
          <p>{currentData?.description}</p>
        </>
      ) : (
        <>Не выбрано</>
      )}
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
        <Routes>
          <Route path="timers/*" element={<Timers />} />
          <Route path="*" element={<p>Work in progress</p>} />
        </Routes>
        {/* <Settings id={id} group={group} /> */}
      </Allotment.Pane>
      <Allotment.Pane snap>
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
