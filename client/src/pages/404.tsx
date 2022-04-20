import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="h-screen flex justify-center items-center flex-col">
      <h2 className="font-semibold text-xl mb-3">Page not found.</h2>
      <Link to="/" className="hover:underline text-lime-600 font-bold">
        Go back home &rarr;
      </Link>
    </div>
  );
};

export default NotFound;
