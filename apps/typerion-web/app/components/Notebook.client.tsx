import type {FC} from 'react';
import {Notebook as NotebookComponent} from 'typerion';

/*
 * Types.
 */

type NotebookProps = {
  typnb: unknown | undefined;
  onSave: (typnb: unknown) => void;
};

/*
 * Component.
 */

export const Notebook: FC<NotebookProps> = ({typnb, onSave}) => (
  <NotebookComponent typnb={typnb} onSave={onSave} />
);
