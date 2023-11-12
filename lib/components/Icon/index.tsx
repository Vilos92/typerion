import {Play, ArrowCounterClockwise} from 'phosphor-react';
import {FC} from 'react';

/*
 * Types.
 */

export enum IconTypesEnum {
  PLAY = 'play',
  RESET = 'reset'
}

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
