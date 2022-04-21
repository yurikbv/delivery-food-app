import React from 'react';
import logo from '../images/logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useMe } from '../hooks/useMe';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { data } = useMe();
  return (
    <>
      {!data?.me.verified && (
        <div className="bg-red-500 py-3 text-center text-white">
          <span>Please verify your email.</span>
        </div>
      )}
      <header className="py-4">
        <div className="container px-5 xl:px-0 flex justify-between items-center">
          <img src={logo} alt="Logo" className="w-24" />
          <span className="text-sm">
            <Link to="/my-profile" className="flex">
              <FontAwesomeIcon icon={faUser} className="text-xl mr-2" />
              {data?.me.email}
            </Link>
          </span>
        </div>
      </header>
    </>
  );
};

export default Header;
