import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      const redirectPath = localStorage.getItem('redirectPath') || '/';
      localStorage.removeItem('redirectPath');
      navigate(redirectPath);
    }
  }, [isLoggedIn, navigate]);

  const onSubmit = async (data) => {
    const success = await login(data);
    if (success) {
      const redirectPath = localStorage.getItem('redirectPath') || '/';
      localStorage.removeItem('redirectPath');
      navigate(redirectPath);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          name="email"
          type="email"
          placeholder="Email"
          register={register}
          required="Email is required"
          error={errors.email}
        />
        
        <Input
          name="password"
          type="password"
          placeholder="Password"
          register={register}
          required="Password is required"
          error={errors.password}
        />
        
        <Button type="submit" variant="primary" className="w-full">
          Login
        </Button>
      </form>
      
      <p className="mt-4 text-center">
        Don't have an account? <Link to="/register" className="text-blue-500">Register</Link>
      </p>
    </div>
  );
};

export default Login;