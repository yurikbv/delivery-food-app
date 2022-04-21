import React, { useEffect, useState } from 'react';
import { gql, useApolloClient, useMutation } from '@apollo/client';
import {
  verifyEmail,
  verifyEmailVariables,
} from '../../__generated__/verifyEmail';
import { useMe } from '../../hooks/useMe';
import FormError from '../../components/FormError';
import { useNavigate } from 'react-router-dom';

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

const ConfirmEmail = () => {
  const { data: userData } = useMe();
  const navigate = useNavigate();
  const client = useApolloClient();
  const [verError, serVerError] = useState('');

  const onCompleted = (data: verifyEmail) => {
    const {
      verifyEmail: { ok, error },
    } = data;
    if (error) {
      serVerError(error);
      return;
    }
    if (ok && userData?.me.id) {
      client.writeFragment({
        id: `User:${userData?.me.id}`,
        fragment: gql`
          fragment VerifyUser on User {
            verified
          }
        `,
        data: {
          verified: true,
        },
      });
      navigate('/', { replace: true });
    }
  };

  const [verifyEmail] = useMutation<verifyEmail, verifyEmailVariables>(
    VERIFY_EMAIL_MUTATION,
    {
      onCompleted,
    },
  );

  useEffect(() => {
    const [_, code] = window.location.href.split('code=');
    verifyEmail({
      variables: {
        input: {
          code,
        },
      },
    });
  }, []);

  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <h2 className="text-lg mb-1 font-medium">Confirming email...</h2>
      <h4 className="text-gray-700 text-sm">
        Please wait, don't close this page...
      </h4>
      {Boolean(verError) && <FormError errorMessage={verError} />}
    </div>
  );
};

export default ConfirmEmail;
