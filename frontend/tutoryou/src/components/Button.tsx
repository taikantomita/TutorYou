import React from "react";

interface ButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="w-full py-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600"
  >
    {children}
  </button>
);

export default Button;
