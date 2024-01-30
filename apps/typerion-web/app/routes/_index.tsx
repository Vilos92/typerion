import {useFormAction, useSubmit} from '@remix-run/react';
import {type ActionFunctionArgs, type MetaFunction, redirect} from '@vercel/remix';
import {notebookTable} from 'db/schema';
import {type Typnb} from 'typerion';
// import {z} from 'zod';
import {db} from '~/../db/db';
import {NotebookPage} from '~/components/NotebookPage';

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

export async function action({request}: ActionFunctionArgs) {
  const form = await request.formData();
  const body = form.get('body');
  if (!body || typeof body !== 'string') {
    throw new Response('Missing typnb body', {status: 400, statusText: 'Bad Request'});
  }

  try {
    const typnb = JSON.parse(body);

    const notebooks = await db.insert(notebookTable).values({typnb}).returning();
    const notebook = notebooks[0];

    return redirect(`/nb/${notebook.id}`);
  } catch {
    throw new Response('Malformed typnb body', {status: 400, statusText: 'Bad Request'});
  }
}

export default function IndexRoute() {
  const action = useFormAction();
  const submit = useSubmit();

  const onShare = (typnb: Typnb) => {
    submit({body: JSON.stringify(typnb)}, {method: 'post', action});
  };

  return (
    <main className={mainStyle}>
      <NotebookPage onShare={onShare} />
    </main>
  );
}
