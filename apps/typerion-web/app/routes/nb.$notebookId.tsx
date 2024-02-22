import {useFormAction, useLoaderData, useSubmit} from '@remix-run/react';
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
  json,
  redirect
} from '@vercel/remix';
import {decodeNotebook, hashTypnb, notebookTable, serializeNotebook} from 'db/schema';
import {decodeTypnb} from 'db/typnb';
import {eq} from 'drizzle-orm';
import {type Typnb} from 'typerion';
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

export async function action({request, params}: ActionFunctionArgs) {
  const notebookId = params.notebookId && parseInt(params.notebookId, 10);
  if (!notebookId) {
    throw new Response(`Notebook not found: ${notebookId}`, {status: 404, statusText: 'Not Found'});
  }

  const form = await request.formData();
  const body = form.get('body');
  if (!body || typeof body !== 'string') {
    throw new Response('Missing typnb body', {status: 400, statusText: 'Bad Request'});
  }

  const previousHash = form.get('previous_hash');
  if (!previousHash || typeof previousHash !== 'string') {
    throw new Response('Missing typnb hash', {status: 400, statusText: 'Bad Request'});
  }

  try {
    const typnbRaw = JSON.parse(body);
    const typnb = decodeTypnb(typnbRaw);

    const hash = await hashTypnb(typnb);

    // If the hash has not changed, set the typnb and return.
    if (hash === previousHash) {
      const notebooks = await db
        .update(notebookTable)
        .set({typnb})
        .where(eq(notebookTable.id, notebookId))
        .returning();
      const notebook = decodeNotebook(notebooks[0]);

      return redirect(`/nb/${notebook.id}`);
    }

    // If the hash has changed, insert a new notebook with a new parent.
    const notebookInsert = serializeNotebook({typnb, hash, parentId: notebookId});
    const notebooks = await db.insert(notebookTable).values(notebookInsert).returning();
    const notebook = notebooks[0];

    return redirect(`/nb/${notebook.id}`);
  } catch {
    throw new Response('Malformed typnb body', {status: 400, statusText: 'Bad Request'});
  }
}

export async function loader({params}: LoaderFunctionArgs) {
  const notebookId = params.notebookId && parseInt(params.notebookId, 10);
  if (!notebookId) {
    throw new Response(`Notebook not found: ${notebookId}`, {status: 404, statusText: 'Not Found'});
  }

  const notebooks = await db.select().from(notebookTable).where(eq(notebookTable.id, notebookId));
  if (!notebooks[0]) {
    throw new Response(`Notebook not found: ${notebookId}`, {status: 404, statusText: 'Not Found'});
  }

  try {
    return json({
      notebook: decodeNotebook(notebooks[0])
    });
  } catch {
    throw new Response('Could not load typnb notebook', {status: 500, statusText: 'Internal Server Error'});
  }
}

export default function NotebookRoute() {
  const action = useFormAction();
  const submit = useSubmit();
  const {notebook} = useLoaderData<typeof loader>();
  const notebookAsRightType = {
    ...notebook,
    createdAt: new Date(notebook.createdAt),
    updatedAt: new Date(notebook.updatedAt)
  };

  const onShare = (typnb: Typnb) => {
    submit({body: JSON.stringify(typnb), previous_hash: notebook.hash}, {method: 'post', action});
  };

  return (
    <main className={mainStyle}>
      <NotebookPage notebook={notebookAsRightType} onShare={onShare} />
    </main>
  );
}
