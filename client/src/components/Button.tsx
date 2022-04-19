import React from 'react';

interface IButtonProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
}

const Button: React.FC<IButtonProps> = ({ canClick, loading, actionText }) => {
  return (
    <button
      className={`btn__form ${
        canClick
          ? 'bg-lime-500 hover:bg-lime-800'
          : 'bg-gray-300 pointer-events-none'
      }`}
    >
      {loading ? 'Loading...' : actionText}
    </button>
  );
};

export default Button;
