import React from "react";

export interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ value, onValueChange, children }) => (
  <div className="w-full">
    <select
      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
      value={value}
      onChange={e => onValueChange(e.target.value)}
    >
      {children}
    </select>
  </div>
);

export const SelectTrigger: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <div className={`relative ${className}`}>{children}
  </div>
);

export const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder }) => (
  <option value="" disabled hidden>{placeholder}</option>
);

export const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

export const SelectItem: React.FC<{ value: string; children: React.ReactNode }> = ({ value, children }) => (
  <option value={value}>{children}</option>
);
