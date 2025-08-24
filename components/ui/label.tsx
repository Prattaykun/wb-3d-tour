import React from "react";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label: React.FC<LabelProps> = ({ children, ...props }) => (
  <label className="text-sm font-medium text-gray-700" {...props}>
    {children}
  </label>
);
