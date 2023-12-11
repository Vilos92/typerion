import type {MetaFunction} from '@vercel/remix';
import {Notebook} from '~/components/Notebook.client';
import {useIsMounted} from '~/hooks/hooks';

import {mainStyle} from './index.css';

export const meta: MetaFunction = () => {
  return [
    {title: 'Typerion'},
    {
      name: 'A TypeScript notebook for developing, prototyping, and sharing software,',
      content: 'Welcome to Typerion!'
    }
  ];
};

export default function Index() {
  const isMounted = useIsMounted();

  return <main className={mainStyle}>{isMounted ? <Notebook /> : null}</main>;
}
