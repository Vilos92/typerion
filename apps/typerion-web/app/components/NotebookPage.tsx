import {Link} from '@remix-run/react';
import type {Notebook as NotebookType} from 'db/schema';
import type {FC} from 'react';
import {type Typnb} from 'typerion';
import githubLogo from '~/assets/githubLogo.svg';
import githubLogoDark from '~/assets/githubLogoDark.svg';
import npmLogo from '~/assets/npmLogo.svg';
import {Notebook} from '~/components/Notebook.client';
import {useIsMounted} from '~/hooks/hooks';

import {
  bottomNavButtonStyle,
  bottomNavStyle,
  logoImgStyle,
  notebookDetailsDivStyle,
  notebookDetailsItemDivStyle,
  notebookDetailsSidebarDivStyle,
  notebookDivStyle,
  notebookPageDivStyle
} from './notebookPage.css';

/*
 * Types.
 */

type NotebookPageProps = {
  notebook?: NotebookType;
  onShare: (typnb: Typnb) => void;
};

export const NotebookPage: FC<NotebookPageProps> = ({notebook, onShare}) => {
  const isMounted = useIsMounted();

  return (
    <>
      <div className={notebookPageDivStyle}>
        <div className={notebookDetailsSidebarDivStyle}>
          {isMounted && notebook && (
            <div className={notebookDetailsDivStyle}>
              <Link to={formatNotebookUrl(notebook.id)} reloadDocument>
                <div className={notebookDetailsItemDivStyle}>Editing: nb/{notebook.id}</div>
              </Link>
              {notebook.parentId && (
                <Link to={formatNotebookUrl(notebook.parentId)} reloadDocument>
                  <div className={notebookDetailsItemDivStyle}>Forked: nb/{notebook.parentId}</div>
                </Link>
              )}
            </div>
          )}
        </div>
        <div className={notebookDivStyle}>
          {isMounted ? <Notebook typnb={notebook?.typnb} onShare={onShare} /> : null}
        </div>
      </div>
      <nav className={bottomNavStyle}>
        <Link to="https://github.com/Vilos92/typerion">
          <button className={bottomNavButtonStyle}>
            <picture>
              <source srcSet={githubLogo} media="(prefers-color-scheme: light)" />
              <img className={logoImgStyle} src={githubLogoDark} alt="GitHub logo" />
            </picture>
            GitHub
          </button>
        </Link>
        <Link to="https://www.npmjs.com/package/typerion">
          <button className={bottomNavButtonStyle}>
            <img className={logoImgStyle} src={npmLogo} alt="npm logo" />
            npm
          </button>
        </Link>
      </nav>
    </>
  );
};

/*
 * Helpers.
 */

function formatNotebookUrl(notebookId: number): string {
  const {protocol, host} = window.location;
  return `${protocol}//${host}/nb/${notebookId}`;
}
