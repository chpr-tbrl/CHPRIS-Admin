import React from "react";
import {
  Header,
  SideNav,
  HeaderName,
  SideNavItems,
  SkipToContent,
  HeaderMenuItem,
  HeaderContainer,
  HeaderMenuButton,
  HeaderNavigation,
  HeaderSideNavItems,
} from "@carbon/react";

import { NavLink } from "react-router-dom";

export const Navbar = () => {
  return (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <Header aria-label="CHPR Information System">
          <SkipToContent />
          <HeaderMenuButton
            aria-label="Open menu"
            onClick={onClickSideNavExpand}
            isActive={isSideNavExpanded}
          />
          <HeaderName href="#" prefix="CHPRIS">
            Admin
          </HeaderName>
          <HeaderNavigation aria-label="CHPR IS">
            <HeaderMenuItem element={NavLink} to="/login">
              Login
            </HeaderMenuItem>
          </HeaderNavigation>
          <SideNav
            aria-label="Side navigation"
            expanded={isSideNavExpanded}
            isPersistent={false}
          >
            <SideNavItems>
              <HeaderSideNavItems>
                <HeaderMenuItem element={NavLink} to="/login">
                  Login
                </HeaderMenuItem>
              </HeaderSideNavItems>
            </SideNavItems>
          </SideNav>
        </Header>
      )}
    />
  );
};
