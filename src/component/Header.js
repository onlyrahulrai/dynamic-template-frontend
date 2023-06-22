import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavbarText,
  NavItem,
} from "reactstrap";
import useAuthStore from "../state/useAuthStore";

function Header(args) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore((state) => state);

  const toggle = () => setIsOpen(!isOpen);

  const onLogoutUser = () => {
    Promise.resolve(localStorage.removeItem("authTokens")).then(() =>
      window.location.reload()
    );
  };

  return (
    <div className="mx-5">
      <Navbar {...args} expand="md">
        <Link className="navbar-brand" to="/">
          Amojo
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="me-auto" navbar>
            <NavItem className="mx-3">
              <Link to="/directories" className="text-decoration-none text-secondary">Directories</Link>
            </NavItem>
            <NavItem className="mx-3">
              <Link to="/themes" className="text-decoration-none text-secondary">Themes</Link>
            </NavItem>
          </Nav>
          <Nav>
            {user ? <NavItem>Hi, {user?.username}</NavItem> : null}
            <NavItem
              className="mx-3"
              onClick={onLogoutUser}
              style={{ cursor: "pointer" }}
            >
              Logout
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default Header;
