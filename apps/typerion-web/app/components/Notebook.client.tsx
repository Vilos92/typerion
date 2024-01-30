import type {FC} from 'react';
import {Notebook as NotebookComponent} from 'typerion';

/*
 * Types.
 */

type NotebookProps = {
  typnb: unknown | undefined;
  onShare: (typnb: unknown) => void;
};

/*
 * Component.
 */

export const Notebook: FC<NotebookProps> = ({typnb, onShare}) => (
  <NotebookComponent typnb={typnb} onShare={onShare} />
);
