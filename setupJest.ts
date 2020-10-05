import 'jest';
import { configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

// We need to mock window.scrollTo or else it won't be defined within the tests
window.scrollTo = jest.fn();

// Configure Enzyme
configure({ adapter: new Adapter() });
