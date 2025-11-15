import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface ForgotForm {
    email: string;
}

const ForgotPasswordPage: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<ForgotForm>();
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit: SubmitHandler<ForgotForm> = async (data) => {
        setIsLoading(true);
        setMessage('');
        try {
            // Note: This calls the backend endpoint we created in Phase I
            const response = await axios.post('http://localhost:5000/api/users/forgot-password', data);
            setMessage(response.data.message || 'Password reset link sent! Check your console for the test URL.');
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Error processing request.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            {message && <p style={{ color: message.startsWith('Error') ? 'red' : 'green' }}>{message}</p>}
            
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <input type="email" placeholder="Enter your email" {...register('email', { required: 'Email is required' })} />
                    {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Request Reset Link'}
                </button>
            </form>
            <p>
                Remembered your password? <Link to="/login">Sign In</Link>
            </p>
        </div>
    );
};

export default ForgotPasswordPage;