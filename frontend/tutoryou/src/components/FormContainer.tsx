import React from "react";

interface FormContainerProps {
  children: React.ReactNode;
}

const FormContainer: React.FC<FormContainerProps> = ({ children }) => (
  <div className="flex min-h-screen items-center justify-center bg-gray-100">
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
      {children}
    </div>
  </div>
);

export default FormContainer;
