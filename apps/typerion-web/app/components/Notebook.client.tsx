import type {FC} from 'react';
import {Notebook as NotebookComponent} from 'typerion';

/*
 * Types.
 */

type NotebookProps = {
  onSave: (typnb: unknown) => void;
};

/*
 * Component.
 */

export const Notebook: FC<NotebookProps> = ({onSave}) => <NotebookComponent onSave={onSave} />;
