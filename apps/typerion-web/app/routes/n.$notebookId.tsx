import {Form, useLoaderData, useNavigation} from '@remix-run/react';
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

export async function action({request}: ActionFunctionArgs) {
  await db.insert(notebookTable).values({typnb: {}}).returning();

  return {
    success: true
  };
}

export default function NotebookRoute() {
  const navigation = useNavigation();

  const {notebook} = useLoaderData<typeof loader>();

  console.log('notebook items', notebook);

  return (
    <main className={mainStyle}>
      <Form method="POST">
        <fieldset disabled={navigation.state === 'submitting'}>
          <button type="submit">{navigation.state === 'submitting' ? 'Save' : 'Saving'}</button>
        </fieldset>
      </Form>
      <NotebookPage />
    </main>
  );
}
