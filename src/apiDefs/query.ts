/*
  This file contains the core functionality for interacting with our API definitions. We intend to
  move our API definitions to a database in the future so we do not have to maintain them in 
  Typescript as the program scales (see schema.ts for more info). In preparation for this change,
  developers should not write new code that relies directly on the Typescript objects exported from other
  files in this directory. Instead, they should rely on the functions exported from this file and the other
  modules listed below to abstract away the form of data storage.

  The following modules supplement the core data access functions defined here. They can be safely consumed 
  by React components, Redux lifecycle hooks, and other parts of the application outside src/apiDefs.
  - deprecated.ts
  - env.ts 
  - schema.ts
*/

import apiDefs, { apiCategoryOrder } from './data/categories';
import { IApiCategories, IApiCategory, IApiDescription } from './schema';

const getApiDefinitions = (): IApiCategories => apiDefs;
const getApiCategoryOrder = (): string[] => apiCategoryOrder;

const getAllApis = (): IApiDescription[] =>
  Object.values(getApiDefinitions()).flatMap((category: IApiCategory) => category.apis);

const lookupApiByFragment = (apiKey: string): IApiDescription | null => {
  const hasMatchingIdentifier = (apiDesc: IApiDescription): boolean =>
    apiDesc.urlFragment === apiKey;
  const apiResult = getAllApis().find(hasMatchingIdentifier);
  return apiResult || null;
};

const lookupApiCategory = (categoryKey: string): IApiCategory | null =>
  apiDefs[categoryKey] || null;

const apisFor = (apiList: string[]): IApiDescription[] => {
  const allApis = getAllApis();
  const searchedApiSet = new Set<string>(apiList);
  return allApis.filter((api: IApiDescription) => searchedApiSet.has(api.urlFragment));
};

const includesOAuthAPI = (apiList: string[]): boolean => apisFor(apiList).some(api => !!api.oAuth);

export {
  getAllApis,
  getApiCategoryOrder,
  getApiDefinitions,
  lookupApiByFragment,
  lookupApiCategory,
  includesOAuthAPI,
};
