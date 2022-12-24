import { Route, Routes } from 'react-router-dom';

import Adc from './Adc';

const Analog = () => (
  <Routes>
    <Route path="adc" element={<Adc />} />
  </Routes>
);

export default Analog;
