import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Register = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { checkAuth } = useAuthStore();
  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      await api.post('/auth/register', data);
      await checkAuth(); // Updates Zustand state
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      
      {/* ── Background Effect ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] mix-blend-multiply pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card w-full max-w-md p-8 sm:p-10 rounded-2xl relative z-10 shadow-sm"
      >
        {/* ── Header ── */}
        <div className="text-center mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary text-white font-bold font-display text-2xl shadow-md shadow-primary/20 mb-6 hover:scale-105 transition-transform duration-200"
          >
            N
          </Link>
          <h2 className="text-3xl font-display font-semibold text-text-primary mb-2 tracking-tight">
            Create an account
          </h2>
          <p className="text-text-muted text-sm sm:text-base">
            Start writing with absolute clarity
          </p>
        </div>

        {/* ── Error State ── */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-center font-medium">
            {error}
          </div>
        )}

        {/* ── Form ── */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input 
            label="Name" 
            type="text" 
            placeholder="John Doe"
            error={errors.name?.message}
            {...register("name", { 
              required: "Name is required",
            })} 
          />

          <Input 
            label="Email" 
            type="email" 
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email", { 
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })} 
          />
          
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password", { 
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters" }
            })} 
          />

          <Input 
            label="Confirm Password" 
            type="password" 
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword", { 
              required: "Confirm Password is required",
              validate: value => value === password || "The passwords do not match"
            })} 
          />

          <Button type="submit" className="w-full mt-4 h-11 shadow-sm" isLoading={isLoading}>
            Sign Up
          </Button>
        </form>

        {/* ── Footer Link ── */}
        <div className="mt-8 text-center text-sm text-text-muted">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="text-text-primary hover:text-primary transition-colors duration-150 font-semibold inline-flex items-center justify-center gap-1 group"
          >
            Log in <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;