import type {FC} from 'react';
import {Notebook as NotebookComponent, type Typnb} from 'typerion';

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

export const Notebook: FC<NotebookProps> = ({typnb, onShare}) => (
  <NotebookComponent typnb={typnb} onShare={onShare} />
);
