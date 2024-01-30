import type {FC} from 'react';
import {type Typnb, decodeTypnb} from 'typerion';
import {Notebook as NotebookComponent} from 'typerion';

/*
 * Types.
 */

type NotebookProps = {
  typnb: Typnb | undefined;
  onShare: (typnb: Typnb) => void;
};

/*
 * Component.
 */

export const Notebook: FC<NotebookProps> = ({typnb, onShare}) => {
  const onShareWrapped = (typnb: Typnb) => {
    return onShare(decodeTypnb(typnb));
  };

  return <NotebookComponent typnb={typnb} onShare={onShareWrapped} />;
};
