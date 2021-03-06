import React from 'react';

interface IFormErrorProps {
  errorMessage: string;
}

const FormError: React.FC<IFormErrorProps> = ({ errorMessage }) => {
  return <span className="font-medium text-red-600">{errorMessage}</span>;
};

export default FormError;
