import { SubmitFormAction, UpdateApplicationAction } from '../actions';
import { IApplication, IApplyInputs, IErrorableInput } from '../types';
import * as constants from '../types/constants';

const newErrorableInput: () => IErrorableInput = () => {
  return {
    dirty: false,
    value: '',
  };
};

const initialApplyInputs: IApplyInputs = {
  apis: {
    appeals: false,
    benefits: false,
    claims: false,
    communityCare: false,
    confirmation: false,
    facilities: false,
    health: false,
    vaForms: false,
    verification: false,
  },
  description: newErrorableInput(),
  email: newErrorableInput(),
  firstName: newErrorableInput(),
  lastName: newErrorableInput(),
  oAuthApplicationType: newErrorableInput(),
  oAuthRedirectURI: newErrorableInput(),
  organization: newErrorableInput(),
  termsOfService: false,
};

export const initialApplicationState: IApplication = {
  inputs: initialApplyInputs,
  sending: false,
};

const applyApis: string[] = Object.keys(constants.APPLY_FIELDS_TO_URL_FRAGMENTS);

export function applicationInput(
  inputs: IApplyInputs = initialApplyInputs,
  action: UpdateApplicationAction,
): IApplyInputs {
  switch (action.type) {
    case constants.UPDATE_APPLICATION_DESCRIPTION:
      return { ...inputs, description: action.newValue };
    case constants.UPDATE_APPLICATION_EMAIL:
      return { ...inputs, email: action.newValue };
    case constants.UPDATE_APPLICATION_FIRST_NAME:
      return { ...inputs, firstName: action.newValue };
    case constants.UPDATE_APPLICATION_LAST_NAME:
      return { ...inputs, lastName: action.newValue };
    case constants.UPDATE_APPLICATION_OAUTH_APPLICATION_TYPE:
      return { ...inputs, oAuthApplicationType: action.newValue };
    case constants.UPDATE_APPLICATION_OAUTH_REDIRECT_URI:
      return { ...inputs, oAuthRedirectURI: action.newValue };
    case constants.UPDATE_APPLICATION_ORGANIZATION:
      return { ...inputs, organization: action.newValue };
    case constants.TOGGLE_SELECTED_API:
      if (!applyApis.includes(action.apiId)) {
        return inputs;
      }

      const isApiSelected = !inputs.apis[action.apiId];
      return { ...inputs, apis: { ... inputs.apis, [action.apiId]: isApiSelected }};
    case constants.TOGGLE_ACCEPT_TOS:
      const termsOfService = !inputs.termsOfService;
      return { ...inputs, termsOfService };
  }
  return inputs;
}

export function application(
  state: IApplication = initialApplicationState,
  action: SubmitFormAction | UpdateApplicationAction,
): IApplication {
  switch (action.type) {
    case constants.SUBMIT_APPLICATION_BEGIN:
      return { ...state, sending: true, errorStatus: undefined };
    case constants.SUBMIT_APPLICATION_SUCCESS:
      return {
        ...state,
        inputs: initialApplyInputs,
        result: {
          apis: state.inputs.apis,
          clientID: action.clientID,
          clientSecret: action.clientSecret,
          email: state.inputs.email.value,
          token: action.token,
        },
        sending: false,
      };
    case constants.SUBMIT_APPLICATION_ERROR:
      return { ...state, sending: false, errorStatus: action.status };
    default:
      return { ...state, inputs: applicationInput(state.inputs, action) };
  }
}
