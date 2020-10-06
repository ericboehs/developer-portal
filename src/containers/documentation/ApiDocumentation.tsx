import * as React from 'react';
import { useDispatch } from 'react-redux';

import { Flag } from 'flag';
import { Location } from 'history';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import * as actions from '../../actions';
import { IApiDescription, IApiDocSource } from '../../apiDefs/schema';

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

  const setApiVersionFromQueryParams = React.useCallback((): void => {  
    const params = new URLSearchParams(location.search);
    dispatch(actions.setRequstedApiVersion(params.get('version')));
  }, [dispatch, location.search]);

  React.useEffect((): void => {
    setApiVersionFromQueryParams();
  }, [setApiVersionFromQueryParams]);

  React.useEffect((): void => {
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

  const getTabIndexFromQueryParams = React.useCallback((): number => {
    if (location.search) {
      const params = new URLSearchParams(history.location.search);
  
      const hasKey = (source: IApiDocSource) => !!source.key;
      const tabKeys = apiDefinition.docSources
        .filter(hasKey)
        .map(source => source.key?.toLowerCase());
      const tabQuery = params.get('tab');
      const fromFragment = tabQuery ? tabQuery.toLowerCase() : '';
      const sourceTabIndex = tabKeys.findIndex(sourceKey => sourceKey === fromFragment);
      return sourceTabIndex === -1 ? tabIndex : sourceTabIndex;
    }
  
    return tabIndex;
  }, [location.search, apiDefinition.docSources, tabIndex]);

  const setTabIndexFromQueryParams = React.useCallback((): void => {
    if (apiDefinition.docSources.length > 1) {
      const newTabIndex = getTabIndexFromQueryParams();
      setTabIndex(newTabIndex);
    }
  }, [apiDefinition, getTabIndexFromQueryParams]);

  React.useEffect((): void => {
    setTabIndexFromQueryParams();
  }, [setTabIndexFromQueryParams]);

  React.useEffect((): void => {
    if (
      location.pathname !== prevLocation?.pathname ||
      location.search !== prevLocation?.search
    ) {
      setTabIndexFromQueryParams();
    }
  }, [location.pathname, location.search, setTabIndexFromQueryParams, prevLocation]);

  const onTabSelect = (selectedTabIndex: number): void => {
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