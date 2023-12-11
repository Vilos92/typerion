import {Link} from '@remix-run/react';
import type {MetaFunction} from '@vercel/remix';
import githubLogo from '~/assets/githubLogo.svg';
import githubLogoDark from '~/assets/githubLogoDark.svg';
import npmLogo from '~/assets/npmLogo.svg';
import {Notebook} from '~/components/Notebook.client';
import {useIsMounted} from '~/hooks/hooks';

import {bottomNavButtonStyle, bottomNavStyle, logoImgStyle, mainStyle} from './index.css';

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

  return (
    <main className={mainStyle}>
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
    </main>
  );
}
