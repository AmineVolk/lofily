import React from 'react';

import { Button } from './Button';

type Props = {
  onClick: () => void;
  icon: JSX.Element;
  right?: boolean;
  active?: boolean;
  className?: string;
};
const IconButton = ({ onClick, icon, right, ...otherProps }: Props) => {
  return (
    <Button onClick={onClick} {...otherProps}>
      <div
        className={`flex items-center space-x-1  ${
          right ? 'flex-row-reverse' : ''
        }`}
      >
        <div className='w-6'> {icon}</div>
      </div>
    </Button>
  );
};

export { IconButton };
