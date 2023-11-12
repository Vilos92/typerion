import {Play, ArrowCounterClockwise} from 'phosphor-react';
import {FC} from 'react';
import {IconTypesEnum} from './types';

/*
 * Types.
 */

type IconProps = {
  type: IconTypesEnum;
};

/*
 * Component.
 */

export const Icon: FC<IconProps> = ({type}) => {
  switch (type) {
    case 'play':
      return <Play />;
    case 'reset':
      return <ArrowCounterClockwise />;
  }
};
