import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

interface ResetForm {
    password: string;
    confirmPassword: string;
}

const ResetPasswordPage: React.FC = () => {
    const { token } = useParams<{ token: string }>(); // Get the token from React Router
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetForm>();
    const newPassword = watch('password');

    const onSubmit: SubmitHandler<ResetForm> = async (data) => {
        if (data.password !== data.confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        setMessage('');
        try {
            // Note: This calls the backend endpoint we created in Phase I
            const response = await axios.put(`http://localhost:5000/api/users/reset-password/${token}`, {
                password: data.password,
            });

            setMessage(response.data.message || 'Password reset successful!');
            setTimeout(() => {
                navigate('/login'); // Redirect to login after success
            }, 3000);

        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Invalid or expired token. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            {message && <p style={{ color: message.startsWith('Password reset successful') ? 'green' : 'red' }}>{message}</p>}
            
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <input type="password" placeholder="New Password" {...register('password', { 
                        required: 'Password is required', 
                        minLength: { value: 6, message: 'Must be at least 6 characters' }
                    })} />
                    {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
                </div>
                <div>
                    <input type="password" placeholder="Confirm New Password" {...register('confirmPassword', {
                        required: 'Confirm password is required',
                        validate: (value) => value === newPassword || 'Passwords must match'
                    })} />
                    {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword.message}</p>}
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
            <p><Link to="/login">Back to Login</Link></p>
        </div>
    );
};

export default ResetPasswordPage;