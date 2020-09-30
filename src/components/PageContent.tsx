import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { SiteRoutes } from '../Routes';

const PageContent = (props: RouteComponentProps): JSX.Element => {
  const mainRef = React.useRef<HTMLElement>(null);
  const prevLocationRef = React.useRef<string | null>(null);

  const { location } = props;

  React.useEffect(() => {
    const currentPath = location.pathname && location.hash;

    if (prevLocationRef?.current) {
      if (prevLocationRef.current === currentPath) {
        return;
      }

      if (mainRef?.current) {
        mainRef.current.focus();
      }
      window.scrollTo(0, 0);
    }

    prevLocationRef.current = currentPath;
  }, [location]);

  return (
    <main id="main" ref={mainRef} tabIndex={-1}>
      <SiteRoutes />
    </main>
  );
};

PageContent.propTypes = {};

export default PageContent;
