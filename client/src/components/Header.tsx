import React from 'react';
import logo from '../images/logo.svg';

const Header = () => {
  return (
    <header className="py-1">
      <div className="container">
        <img src={logo} alt="Logo" className="w-60 mb-10" />
        Header
      </div>
    </header>
  );
};

export default Header;
