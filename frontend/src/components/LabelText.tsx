import React from 'react';

interface LabelTextProps {
  label: string;
  required?: boolean;
}

const LabelText: React.FC<LabelTextProps> = ({ label, required = false }) => {
  return (
    <label className="label text-xs mb-0.5">
      <span className="label-text font-medium">{label}</span>
      {required && <span className="label-text-alt text-primary">Required</span>}
    </label>
  );
};
export default React.memo(LabelText);
