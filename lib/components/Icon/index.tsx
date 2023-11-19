import {
  ArrowCounterClockwise,
  ArrowElbowLeftUp,
  ArrowElbowRightDown,
  PauseCircle,
  Icon as PhosphorIcon,
  Play,
  PlayCircle,
  Plus
} from 'phosphor-react';
import {FC} from 'react';

import {IconTypesEnum} from './types';

/*
 * Types.
 */

type IconProps = {
  className?: string;
  type: IconTypesEnum;
  size?: number;
};

/*
 * Component.
 */

export const Icon: FC<IconProps> = ({className, type, size}) => {
  const PhosphorIcon = computePhosphorIcon(type);
  return <PhosphorIcon className={className} size={size} color="currentColor" />;
};

/*
 * Helpers.
 */

function computePhosphorIcon(type: IconTypesEnum): PhosphorIcon {
  switch (type) {
    case IconTypesEnum.ARROW_ELBOW_LEFT_UP:
      return ArrowElbowLeftUp;
    case IconTypesEnum.ARROW_ELBOW_RIGHT_DOWN:
      return ArrowElbowRightDown;
    case IconTypesEnum.PAUSE_CIRCLE:
      return PauseCircle;
    case IconTypesEnum.PLAY:
      return Play;
    case IconTypesEnum.PLAY_CIRCLE:
      return PlayCircle;
    case IconTypesEnum.PLUS:
      return Plus;
    case IconTypesEnum.RESET:
      return ArrowCounterClockwise;
    default:
      throw new Error(`Unknown icon type: ${type}`);
  }
}
