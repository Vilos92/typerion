import {Form, useNavigation} from '@remix-run/react';
import {type ActionFunctionArgs, type MetaFunction} from '@vercel/remix';
import {notebookTable} from 'db/schema';
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
  await db.insert(notebookTable).values({typnb: {}}).returning();

  return {
    success: true
  };
}

export default function IndexRoute() {
  const navigation = useNavigation();

  console.log('navigation', navigation, navigation.state);

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
