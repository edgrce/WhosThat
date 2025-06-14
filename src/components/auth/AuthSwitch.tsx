import React from 'react';
import { Link } from 'react-router-dom';

type AuthSwitchProps = {
  isLogin: boolean;
};

export const AuthSwitch: React.FC<AuthSwitchProps> = ({ isLogin }) => (
  <div className="text-center mt-4">
    {isLogin ? (
      <p>
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-500 hover:underline">
          Register
        </Link>
      </p>
    ) : (
      <p>
        Already have an account?{' '}
        <Link to="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
    )}
  </div>
);