import React, { Fragment } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { isLoggedInVar } from '../apollo';
import { gql, useQuery } from '@apollo/client';
import { meQuery } from '../__generated__/meQuery';
import { LOCALSTORAGE_TOKEN } from '../constants';
import Restaurants from '../pages/client/restaurants';
import NotFound from '../pages/404';
import Header from '../components/Header';

const clientRoutes = (
  <Fragment>
    <Route path="/" element={<Restaurants />} />
  </Fragment>
);

const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      role
      verified
    }
  }
`;

const LoggedInRouter = () => {
  const { data, loading, error } = useQuery<meQuery>(ME_QUERY);

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );

  if (!data || error) {
    localStorage.removeItem(LOCALSTORAGE_TOKEN);
    isLoggedInVar(false);
  }
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {data?.me.role === 'Client' && clientRoutes}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default LoggedInRouter;
