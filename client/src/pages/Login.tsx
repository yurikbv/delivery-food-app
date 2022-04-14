import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import FormError from '../components/FormError';
import { gql, useMutation } from '@apollo/client';
import {
  loginMutation,
  loginMutationVariables,
} from '../../__generated__/loginMutation';
import logo from '../images/logo.svg';

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
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ILoginForm>();

  const onCompleted = (data: loginMutation) => {
    const {
      login: { error, ok, token },
    } = data;
    if (!ok && error) {
      return setError('result', { message: error });
    }
    console.log(token);
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
    <div className="h-screen flex items-center flex-col mt-32">
      <img src={logo} alt="Logo" className="w-60 mb-5" />
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mt-5 px-5">
        <input
          {...register('email', {
            required: 'Email is required.',
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

        <button className="btn__form" disabled={loading}>
          {loading ? 'Loading...' : 'Log In'}
        </button>

        <ErrorMessage
          errors={errors}
          name="result"
          render={({ message }) => <FormError errorMessage={message} />}
        />
      </form>
    </div>
  );
};

export default Login;
