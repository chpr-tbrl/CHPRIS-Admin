import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  Header,
  Loading,
  SideNav,
  Switcher,
  HeaderName,
  HeaderPanel,
  SwitcherItem,
  SideNavItems,
  SkipToContent,
  HeaderMenuItem,
  SwitcherDivider,
  HeaderGlobalBar,
  HeaderContainer,
  HeaderMenuButton,
  HeaderNavigation,
  HeaderGlobalAction,
  HeaderSideNavItems,
} from "@carbon/react";
import { UserAvatar, Help } from "@carbon/icons-react";
import { useNavigate, NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLogOutMutation } from "services";
import { logout } from "features";

export const DashNavbar = () => {
  const [panelOpen, setPanelOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logOut, { isLoading }] = useLogOutMutation();

  function togglePanel() {
    setPanelOpen(!panelOpen);
  }

  function handleNavigate(path) {
    togglePanel();
    return navigate(path);
  }

  async function handleLogout() {
    try {
      await logOut().unwrap();
      toast.success("Logout Successful");
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      // we handle errors with middleware
    }
  }

  if (isLoading) return <Loading />;
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
          <HeaderNavigation aria-label="menu">
            <HeaderMenuItem element={NavLink} to="users">
              Users
            </HeaderMenuItem>
            <HeaderMenuItem element={NavLink} to="pending">
              Pending
            </HeaderMenuItem>
            <HeaderMenuItem element={NavLink} to="regions">
              Regions
            </HeaderMenuItem>
          </HeaderNavigation>
          <SideNav
            aria-label="Side navigation"
            expanded={isSideNavExpanded}
            isPersistent={false}
          >
            <SideNavItems>
              <HeaderSideNavItems>
                <HeaderMenuItem element={NavLink} to="users">
                  Users
                </HeaderMenuItem>
                <HeaderMenuItem element={NavLink} to="pending">
                  Pending
                </HeaderMenuItem>
                <HeaderMenuItem element={NavLink} to="regions">
                  Regions
                </HeaderMenuItem>
              </HeaderSideNavItems>
            </SideNavItems>
          </SideNav>
          <HeaderGlobalBar>
            <HeaderGlobalAction aria-label="about platform">
              <Help size={20} />
            </HeaderGlobalAction>
            <HeaderGlobalAction
              aria-label="Accounts and settings"
              tooltipAlignment="end"
              onClick={() => togglePanel()}
            >
              <UserAvatar size={20} />
            </HeaderGlobalAction>
          </HeaderGlobalBar>
          <HeaderPanel aria-label="user actions menu" expanded={panelOpen}>
            <Switcher aria-label="Switcher Container">
              <SwitcherItem
                aria-label="account"
                onClick={() => handleNavigate("account")}
              >
                Account
              </SwitcherItem>
              <SwitcherDivider />
              <SwitcherItem aria-label="logout" onClick={() => handleLogout()}>
                Logout
              </SwitcherItem>
            </Switcher>
          </HeaderPanel>
        </Header>
      )}
    />
  );
};
