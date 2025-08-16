import React from 'react';

interface FormControlProps {
  children: React.ReactNode;
}

const FormControl: React.FC<FormControlProps> = ({ children }) => {
  return <div className="form-control">{children}</div>;
};

export default React.memo(FormControl);
