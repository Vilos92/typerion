import {Link} from '@remix-run/react';
import type {FC} from 'react';
import githubLogo from '~/assets/githubLogo.svg';
import githubLogoDark from '~/assets/githubLogoDark.svg';
import npmLogo from '~/assets/npmLogo.svg';
import {Notebook} from '~/components/Notebook.client';
import {useIsMounted} from '~/hooks/hooks';

import {bottomNavButtonStyle, bottomNavStyle, logoImgStyle} from '../routes/index.css';

export const NotebookPage: FC = () => {
  const isMounted = useIsMounted();

  return (
    <>
      {isMounted ? <Notebook /> : null}
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
