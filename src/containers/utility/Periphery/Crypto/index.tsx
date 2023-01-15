import { Route, Routes } from 'react-router-dom';

import Crc from './Crc';

const Crytto = () => (
  <Routes>
    <Route path="crc" element={<Crc />} />
  </Routes>
);

export default Crytto;
