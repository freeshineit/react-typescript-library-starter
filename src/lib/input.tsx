import React from 'react';
import './index.scss';

export interface InputProps {
  value: string;
}

export const Input = () => {
  return <input placeholder='react typescript library starter' />;
};
