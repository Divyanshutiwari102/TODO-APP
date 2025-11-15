import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useTodoStore'; // Correct path

interface SignupForm {
    email: string;
    password: string;
}

const API_URL = 'http://localhost:5000/api/users/signup';

const SignupPage: React.FC = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupForm>();
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const onSubmit: SubmitHandler<SignupForm> = async (data) => {
        try {
            const response = await axios.post(API_URL, data);
            
            const { token, _id, email } = response.data;
            login(token, { _id, email });
            
            navigate('/'); // Redirect to Todo List page
        } catch (error: any) {
            alert(error.response?.data?.message || 'Signup failed.');
        }
    };

    return (
        <div className="auth-container">
            <h2>User Sign-up</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <input type="email" placeholder="Email" {...register('email', { required: 'Email is required' })} />
                    {errors.email && <p style={{color: 'red'}}>{errors.email.message}</p>}
                </div>
                <div>
                    <input type="password" placeholder="Password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Must be at least 6 characters' } })} />
                    {errors.password && <p style={{color: 'red'}}>{errors.password.message}</p>}
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                </button>
            </form>
            <p style={{marginTop: '20px'}}>
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </div>
    );
};

export default SignupPage;