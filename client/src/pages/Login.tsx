import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import FormError from '../components/FormError';
import { gql, useMutation } from '@apollo/client';

interface ILoginForm {
  email: string;
  password: string;
}

const LOGIN_MUTATION = gql`
  mutation PotatoMutation($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
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
    getValues,
    formState: { errors, isValid },
  } = useForm<ILoginForm>();

  const [loginMutation, { loading, error, data }] = useMutation(LOGIN_MUTATION);

  const onSubmit: SubmitHandler<ILoginForm> = data => {
    const { email, password } = data;
    loginMutation({
      variables: {
        email,
        password,
      },
    });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-white w-full max-w-lg pt-5 pb-7 rounded-lg text-center">
        <h3 className="text-2xl text-gray-800">Log In</h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 px-5"
        >
          <input
            {...register('email', {
              required: 'Email is required.',
            })}
            name="email"
            type="email"
            placeholder="email"
            className="input"
          />

          {errors?.email?.message && (
            <FormError errorMessage={errors.email.message} />
          )}

          <input
            {...register('password', {
              required: 'Password is required.',
              minLength: {
                value: 10,
                message: 'Password must exceed 9 characters',
              },
            })}
            name="password"
            type="password"
            placeholder="password"
            className="input"
          />

          {errors?.password?.message && (
            <FormError errorMessage={errors.password.message} />
          )}

          <button className="btn__form">log in</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
