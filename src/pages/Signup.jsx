import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Assuming useAuth is imported from a context
import Button from '../components/Button';
import Input from '../components/Input';

const Signup = () => {
  const { register: formRegister, handleSubmit, formState: { errors }, watch } = useForm();
  const { register } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    if (register(data)) {
      alert('Registration successful! Please login.');
      navigate('/login');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          name="fullName"
          placeholder="Full Name"
          register={formRegister}
          required="Full Name is required"
          error={errors.fullName}
        />
        
        <Input
          name="email"
          type="email"
          placeholder="Email"
          register={formRegister}
          required="Email is required"
          error={errors.email}
        />
        
        <Input
          name="password"
          type="password"
          placeholder="Password"
          register={formRegister}
          required="Password is required"
          minLength={{ value: 6, message: "Password must be at least 6 characters" }}
          error={errors.password}
        />
        
        <Input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          register={formRegister}
          required="Please confirm your password"
          validate={value => value === watch('password') || "Passwords don't match"}
          error={errors.confirmPassword}
        />
        
        <Input
          name="phone"
          placeholder="Phone Number"
          register={formRegister}
          required="Phone number is required"
          error={errors.phone}
        />
        
        <Button type="submit" variant="primary" className="w-full">
          Register
        </Button>
      </form>
      
      <p className="mt-4 text-center">
        Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
      </p>
    </div>
  );
};

export default Signup;