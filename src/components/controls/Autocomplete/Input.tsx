import { forwardRef } from 'react';

import { InputProps } from './types';

const DefaultInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => <input ref={ref} {...props} />);

export default DefaultInput;
