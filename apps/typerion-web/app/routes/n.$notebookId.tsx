import {useFormAction, useLoaderData, useSubmit} from '@remix-run/react';
import {type ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction, json} from '@vercel/remix';
import {notebookTable} from 'db/schema';
import {eq} from 'drizzle-orm';
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

    await db.insert(notebookTable).values({typnb}).returning();

    return {
      success: true
    };
  } catch {
    throw new Response('Malformed typnb body', {status: 400, statusText: 'Bad Request'});
  }
}

export async function loader({request, params}: LoaderFunctionArgs) {
  const notebookId = params.notebookId && parseInt(params.notebookId, 10);
  if (!notebookId) {
    throw new Response(`Notebook not found: ${notebookId}`, {status: 404, statusText: 'Not Found'});
  }

  const notebooks = await db.select().from(notebookTable).where(eq(notebookTable.id, notebookId));
  if (!notebooks[0]) {
    throw new Response(`Notebook not found: ${notebookId}`, {status: 404, statusText: 'Not Found'});
  }

  return json({
    notebook: notebooks[0]
  });
}

export default function NotebookRoute() {
  const action = useFormAction();
  const submit = useSubmit();
  const {notebook} = useLoaderData<typeof loader>();

  const onSave = (typnb: unknown) => {
    submit({body: JSON.stringify(typnb)}, {method: 'post', action});
  };

  console.log('notebook items', notebook);

  return (
    <main className={mainStyle}>
      <NotebookPage typnb={notebook.typnb} onSave={onSave} />
    </main>
  );
}
