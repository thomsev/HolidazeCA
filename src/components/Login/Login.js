import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext'; 
import { API_BASE_URL } from '../../constants/apiConstants';
import './Login.css';

const schema = yup.object({
  email: yup.string().email().required("Email is required"),
  password: yup.string().required("Password is required"),
}).required();

function Login() {
  const navigate = useNavigate(); 
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  const { login } = useAuth(); 

  const onSubmit = async (data) => {
    try {
      const loginEndpoint = `${API_BASE_URL}/auth/login`;
      const response = await fetch(loginEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Failed to login');
      }
  
      const result = await response.json();
      localStorage.setItem('accessToken', result.accessToken);

      login(result.user, result.accessToken); 
  
      window.location.href = '/dashboard'; 
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("email")}
          className="login-input"
          placeholder="Email"
          type="email"
        />
        {errors.email && <p className="error-message">{errors.email.message}</p>}

        <input
          {...register("password")}
          className="login-input"
          type="password"
          placeholder="Password"
        />
        {errors.password && <p className="error-message">{errors.password.message}</p>}

        <button className="login-button" type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
