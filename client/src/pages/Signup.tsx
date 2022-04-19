import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import FormError from '../components/FormError';
import { gql, useMutation } from '@apollo/client';
import { Helmet } from 'react-helmet-async';
import logo from '../images/logo.svg';
import Button from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import {
  createAccountMutation,
  createAccountMutationVariables,
} from '../__generated__/createAccountMutation';
import { UserRole } from '../__generated__/globalTypes';

interface ISignUpForm {
  email: string;
  password: string;
  role: UserRole;
  result?: string;
}

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

const SignUp = () => {
  let navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<ISignUpForm>({
    criteriaMode: 'all',
    mode: 'onChange',
    defaultValues: {
      role: UserRole.Client,
    },
  });

  const onCompleted = (data: createAccountMutation) => {
    const {
      createAccount: { error, ok },
    } = data;
    if (!ok && error) {
      return setError('result', { message: error });
    }
    navigate('/login', { replace: true });
  };

  const [createAccountMutation, { loading }] = useMutation<
    createAccountMutation,
    createAccountMutationVariables
  >(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
  });

  const onSubmit: SubmitHandler<ISignUpForm> = data => {
    if (loading) return;
    const { email, password, role } = data;
    createAccountMutation({
      variables: {
        createAccountInput: {
          email,
          password,
          role,
        },
      },
    });
  };

  const clearLoginError = () => clearErrors('result');
  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>SignUp | Nuber Eats</title>
      </Helmet>
      <div className="w-full px-5 max-w-screen-sm flex flex-col items-center">
        <img src={logo} alt="Logo" className="w-60 mb-10" />
        <h4 className="w-full text-left text-2xl font-medium">
          Let's get started
        </h4>
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
          <select
            className="input"
            {...register('role', {
              required: 'Role is required.',
            })}
          >
            {Object.keys(UserRole).map(role => (
              <option key={role}>{role}</option>
            ))}
          </select>
          <Button canClick={isValid} loading={loading} actionText="Sign up" />
          <ErrorMessage
            errors={errors}
            name="result"
            render={({ message }) => <FormError errorMessage={message} />}
          />
        </form>
        <div>
          Already have an account?{' '}
          <Link to="/login" className="text-lime-600 hover:underline font-bold">
            Log in now.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
