import React, { Fragment } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { isLoggedInVar } from '../apollo';
import { LOCALSTORAGE_TOKEN } from '../constants';
import Restaurants from '../pages/client/restaurants';
import NotFound from '../pages/404';
import Header from '../components/Header';
import { useMe } from '../hooks/useMe';
import ConfirmEmail from '../pages/user/ConfirmEmail';

const clientRoutes = (
  <Fragment>
    <Route path="/" element={<Restaurants />} />
    <Route path="/confirm" element={<ConfirmEmail />} />
  </Fragment>
);

const LoggedInRouter = () => {
  const { data, loading, error } = useMe();

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
