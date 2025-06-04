import React from 'react';
import { Link, NavLink } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="navigation">
      <ul>
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-active" : ""}>
            Catatan Aktif
          </NavLink>
        </li>
        <li>
          <NavLink to="/archived" className={({ isActive }) => isActive ? "nav-active" : ""}>
            Arsip
          </NavLink>
        </li>
        <li>
          <NavLink to="/notes/new" className={({ isActive }) => isActive ? "nav-active" : ""}>
            Tambah Catatan
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;