import React from 'react';

export const Alert: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
      {children}
    </div>
  );
};

export const AlertTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <h4 className="font-bold">{children}</h4>;
};

export const AlertDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <p>{children}</p>;
};
