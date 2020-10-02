import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { SiteRoutes } from '../Routes';

const focusAndScroll = (elementToFocus: HTMLElement | null) => {
  if (elementToFocus) {
    elementToFocus.focus();
  }

  window.scrollTo(0, 0);
};

const PageContent = (props: RouteComponentProps): JSX.Element => {
  const mainRef = React.useRef<HTMLElement>(null);

  const { location } = props;

  React.useEffect(() => {
    focusAndScroll(mainRef.current);
  }, [location.pathname]);

  React.useEffect(() => {
    // If the hash was removed, then we want to scroll back to the top of the page
    if (location.hash === '') {
      focusAndScroll(mainRef.current);
    }
  }, [location.hash]);

  return (
    <main id="main" ref={mainRef} tabIndex={-1}>
      <SiteRoutes />
    </main>
  );
};

PageContent.propTypes = {};

export default PageContent;
