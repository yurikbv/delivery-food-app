import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import FormError from '../components/FormError';
import { gql, useMutation } from '@apollo/client';
import { Helmet } from 'react-helmet-async';
import {
  loginMutation,
  loginMutationVariables,
} from '../__generated__/loginMutation';
import logo from '../images/logo.svg';
import Button from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import { authToken, isLoggedInVar } from '../apollo';
import { LOCALSTORAGE_TOKEN } from '../constants';

interface ILoginForm {
  email: string;
  password: string;
  result?: string;
}

const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;

const Login = () => {
  let navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<ILoginForm>({
    criteriaMode: 'all',
    mode: 'onChange',
  });

  const onCompleted = (data: loginMutation) => {
    const {
      login: { error, ok, token },
    } = data;
    if (error) {
      return setError('result', { message: error });
    }
    localStorage[LOCALSTORAGE_TOKEN] = token;
    authToken(token);
    isLoggedInVar(true);
    navigate('/', { replace: true });
  };

  const [loginMutation, { loading }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  });

  const onSubmit: SubmitHandler<ILoginForm> = data => {
    if (loading) return;
    const { email, password } = data;
    loginMutation({
      variables: {
        loginInput: {
          email,
          password,
        },
      },
    });
  };

  const clearLoginError = () => clearErrors('result');
  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>Login | Nuber Eats</title>
      </Helmet>
      <div className="w-full px-5 max-w-screen-sm flex flex-col items-center">
        <img src={logo} alt="Logo" className="w-60 mb-10" />
        <h4 className="w-full text-left text-2xl font-medium">Welcome back</h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 w-full mb-3"
        >
          <input
            {...register('email', {
              required: 'Email is required.',
              pattern:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            name="email"
            type="email"
            placeholder="email"
            className="input"
            onChange={clearLoginError}
          />

          <ErrorMessage
            errors={errors}
            name="email"
            render={({ message }) => <FormError errorMessage={message} />}
          />
          {errors?.email?.type === 'pattern' && (
            <FormError errorMessage={'Please type a valid email'} />
          )}
          <input
            {...register('password', {
              required: 'Password is required.',
              minLength: {
                value: 6,
                message: 'Password must exceed 5 characters',
              },
            })}
            name="password"
            type="password"
            placeholder="password"
            className="input"
            onChange={clearLoginError}
          />

          <ErrorMessage
            errors={errors}
            name="password"
            render={({ message }) => <FormError errorMessage={message} />}
          />
          <Button canClick={true} loading={loading} actionText="Log In" />
          <ErrorMessage
            errors={errors}
            name="result"
            render={({ message }) => <FormError errorMessage={message} />}
          />
        </form>
        <div>
          New to Nuber?{' '}
          <Link
            to="/signup"
            className="text-lime-600 hover:underline font-bold"
          >
            Create an account.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
