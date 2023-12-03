import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { API_BASE_URL } from '../../constants/apiConstants';
import './Register.css';

const schema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().matches(/@stud.noroff.no$/, "Email must be a stud.noroff.no address").required(),
  password: yup.string().min(8).required(),
  avatar: yup.string().url().nullable(),
  venueManager: yup.boolean(),
});

function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      const registerEndpoint = `${API_BASE_URL}/auth/register`; 
      const response = await fetch(registerEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error registering user');
      }

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
      <input
              {...register("name")}
              className="register-input" 
              placeholder="Username"
            />
            {errors.name && <p className="error-message">{errors.name.message}</p>}
    
            <input
              {...register("email")}
              className="register-input" 
              type="email" 
              placeholder="Email"
            />
            {errors.email && <p className="error-message">{errors.email.message}</p>}
    
            <input
              {...register("password")}
              className="register-input" 
              type="password"
              placeholder="Password"
            />
            {errors.password && <p className="error-message">{errors.password.message}</p>}
    
            <input
              {...register("avatar")}
              className="register-input" 
              placeholder="Avatar URL (optional)"
            />
            {errors.avatar && <p className="error-message">{errors.avatar.message}</p>}
    
            <div className="register-checkbox">
              <label>
                Venue Manager:
                <input type="checkbox" {...register("venueManager")} />
              </label>
            </div>
    
            <button className="register-button" type="submit">Register</button>
          </form>
        </div>
      );
    }

export default Register;
