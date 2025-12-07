import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        setGeneralError('');
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        setGeneralError('');

        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (error) {
            setGeneralError(error.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-background">
                <div className="auth-blob auth-blob-1"></div>
                <div className="auth-blob auth-blob-2"></div>
                <div className="auth-blob auth-blob-3"></div>
            </div>

            <div className="auth-container">
                <div className="auth-card animate-fadeIn">
                    <div className="auth-header">
                        <h1 className="auth-logo">CAMPULSE</h1>
                        <h2 className="auth-title">Welcome Back!</h2>
                        <p className="auth-subtitle">Sign in to continue your productivity journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {generalError && (
                            <div className="auth-error animate-fadeIn">
                                <AlertCircle size={20} />
                                <span>{generalError}</span>
                            </div>
                        )}

                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            icon={<Mail size={20} />}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                            icon={<Lock size={20} />}
                            required
                        />

                        <div className="auth-options">
                            <label className="auth-checkbox">
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="auth-link">Forgot password?</a>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            loading={loading}
                            className="btn-full"
                        >
                            Sign In
                        </Button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/signup" className="auth-link-bold">Sign up for free</Link>
                        </p>
                    </div>
                </div>

                <div className="auth-features">
                    <div className="feature-card animate-slideInRight" style={{ animationDelay: '0.1s' }}>
                        <div className="feature-icon">📚</div>
                        <h3>Smart Planner</h3>
                        <p>Never miss a deadline again</p>
                    </div>
                    <div className="feature-card animate-slideInRight" style={{ animationDelay: '0.2s' }}>
                        <div className="feature-icon">🎯</div>
                        <h3>Opportunities</h3>
                        <p>Find gigs & scholarships</p>
                    </div>
                    <div className="feature-card animate-slideInRight" style={{ animationDelay: '0.3s' }}>
                        <div className="feature-icon">👨‍🏫</div>
                        <h3>Find Tutors</h3>
                        <p>Get academic support</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
