import React from 'react';
import { isLoggedInVar } from '../apollo';

const LoggedInRouter = () => {
  const handleClick = () => isLoggedInVar(false);
  return (
    <div>
      <h1>Log in</h1>
      <button onClick={handleClick}>Click to logout</button>
    </div>
  );
};

export default LoggedInRouter;
