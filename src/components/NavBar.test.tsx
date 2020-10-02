import { shallow } from 'enzyme';
import 'jest';
import { noop } from 'lodash';
import * as React from 'react';

import NavBar from './NavBar';

describe('NavBar', () => {
  it('should render the navbar', () => {
    const documentation = shallow(<NavBar isMobileMenuVisible onMobileNavClose={noop} />).contains(
      'Documentation',
    );
    expect(documentation).toBeTruthy();
  });

  it('should use "va-api-mobile-nav-visible" when isMobileMenuVisible is true', () => {
    let result = shallow(<NavBar isMobileMenuVisible={false} onMobileNavClose={noop} />);
    expect(result.find('nav').hasClass('va-api-mobile-nav-visible')).toBeFalsy();

    result = shallow(<NavBar isMobileMenuVisible onMobileNavClose={noop} />);
    expect(result.find('nav').hasClass('va-api-mobile-nav-visible')).toBeTruthy();
  });
});
