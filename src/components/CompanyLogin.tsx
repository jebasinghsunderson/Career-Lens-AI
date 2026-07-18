import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock } from 'lucide-react';
import { FormField } from './FormField';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';

const companyLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

type CompanyLoginValues = z.infer<typeof companyLoginSchema>;

export const CompanyLogin: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyLoginValues>({
    resolver: zodResolver(companyLoginSchema),
  });

  const onSubmit = (data: CompanyLoginValues) => {
    console.log('Company Login Data:', data);
    alert('Company login successful!');
    navigate('/profile');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <FormField
        label="Official Email"
        type="email"
        icon={<Mail size={18} />}
        placeholder="Enter official email"
        {...register('email')}
        error={errors.email?.message}
      />
      
      <FormField
        label="Password"
        type="password"
        icon={<Lock size={18} />}
        placeholder="Enter your password"
        {...register('password')}
        error={errors.password?.message}
      />
      
      <div className="flex justify-end mb-4">
        <a href="#" className="text-sm font-medium text-blue-600 hover:underline">Forgot password?</a>
      </div>
      
      <Button type="submit" className="mt-2">
        Sign In as Company
      </Button>
    </form>
  );
};
