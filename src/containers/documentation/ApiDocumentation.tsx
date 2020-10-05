import * as React from 'react';
import { useDispatch } from 'react-redux';

import { Flag } from 'flag';
import { Location } from 'history';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import * as actions from '../../actions';
import { IApiDescription } from '../../apiDefs/schema';

import { history } from '../../store';

import usePrevious from '../../hooks/Previous';

import SwaggerDocs from './SwaggerDocs';

import '../../../node_modules/react-tabs/style/react-tabs.scss';

interface IApiDocumentationProps {
  apiDefinition: IApiDescription;
  categoryKey: string;
  location: Location;
}

const ApiDocumentation = (props: IApiDocumentationProps): JSX.Element => {
  const { apiDefinition, location } = props;
  const prevLocation = usePrevious(location);

  /*
   * API Version
   */
  const dispatch = useDispatch();

  const setApiVersionFromQueryParams = React.useCallback(() => {  
    const params = new URLSearchParams(location.search);
    dispatch(actions.setRequstedApiVersion(params.get('version')));
  }, [dispatch, location.search]);

  React.useEffect(() => {
    setApiVersionFromQueryParams();
  }, [setApiVersionFromQueryParams]);

  React.useEffect(() => {
    if (
      location.pathname !== prevLocation?.pathname ||
      location.search !== prevLocation?.search
    ) {
      setApiVersionFromQueryParams();
    }
  }, [location.pathname, location.search, setApiVersionFromQueryParams, prevLocation]);

  /*
   * Tab Index
   */
  const [tabIndex, setTabIndex] = React.useState(0);

  const onTabSelect = (selectedTabIndex: number) => {
    const tab = props.apiDefinition.docSources[selectedTabIndex].key;
    const params = new URLSearchParams(history.location.search);
    if (tab) {
      params.set('tab', tab);
    }
    history.push(`${history.location.pathname}?${params.toString()}`);
    setTabIndex(selectedTabIndex);
  };

  /*
   * RENDER
   */
  return (
    <Flag name={`hosted_apis.${apiDefinition.urlFragment}`}>
      {apiDefinition.docSources.length === 1 ? (
        <SwaggerDocs
          docSource={apiDefinition.docSources[0]}
          apiName={apiDefinition.urlFragment}
        />
      ) : (
        <>
          {apiDefinition.multiOpenAPIIntro && apiDefinition.multiOpenAPIIntro({})}
          <Tabs selectedIndex={tabIndex} onSelect={onTabSelect}>
            <TabList>
              {apiDefinition.docSources.map(apiDocSource => (
                <Tab key={apiDocSource.label}>{apiDocSource.label}</Tab>
              ))}
            </TabList>
            {apiDefinition.docSources.map(apiDocSource => (
              <TabPanel key={apiDocSource.label}>
                <SwaggerDocs docSource={apiDocSource} apiName={apiDefinition.urlFragment} />
              </TabPanel>
            ))}
          </Tabs>
        </>
      )}
    </Flag>
  );
};

export default ApiDocumentation;