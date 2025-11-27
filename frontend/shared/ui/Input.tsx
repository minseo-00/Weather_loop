import React from "react";

interface InputProps {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export default function Input({ type = "text", value, onChange, placeholder }: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  );
}
