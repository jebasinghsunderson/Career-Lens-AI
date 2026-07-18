import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Briefcase, Mail, Phone, Lock, MapPin, Building } from 'lucide-react';
import { FormField } from './FormField';
import { SelectField } from './SelectField';
import { Button } from './Button';

const companySchema = z.object({
  companyName: z.string().min(2, 'Company name must contain at least 2 characters'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must contain at least 6 characters'),
  industry: z.string().min(1, 'Please select an industry'),
  location: z.string().min(1, 'Please select a location'),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the Terms of Use',
  }),
});

type CompanyFormValues = z.infer<typeof companySchema>;

export const CompanyForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
  });

  const onSubmit = (data: CompanyFormValues) => {
    console.log('Company Form Data:', data);
    alert('Company registration successful! Redirecting to Step 2...');
  };

  const industries = [
    { value: 'it', label: 'Information Technology' },
    { value: 'finance', label: 'Finance' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'education', label: 'Education' },
  ];

  const locations = [
    { value: 'andaman_and_nicobar_islands', label: 'Andaman and Nicobar Islands' },
    { value: 'andhra_pradesh', label: 'Andhra Pradesh' },
    { value: 'arunachal_pradesh', label: 'Arunachal Pradesh' },
    { value: 'assam', label: 'Assam' },
    { value: 'bihar', label: 'Bihar' },
    { value: 'chandigarh', label: 'Chandigarh' },
    { value: 'chhattisgarh', label: 'Chhattisgarh' },
    { value: 'dadra_and_nagar_haveli_and_daman_and_diu', label: 'Dadra & Nagar Haveli & Daman & Diu' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'goa', label: 'Goa' },
    { value: 'gujarat', label: 'Gujarat' },
    { value: 'haryana', label: 'Haryana' },
    { value: 'himachal_pradesh', label: 'Himachal Pradesh' },
    { value: 'jammu_and_kashmir', label: 'Jammu and Kashmir' },
    { value: 'jharkhand', label: 'Jharkhand' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'kerala', label: 'Kerala' },
    { value: 'ladakh', label: 'Ladakh' },
    { value: 'lakshadweep', label: 'Lakshadweep' },
    { value: 'madhya_pradesh', label: 'Madhya Pradesh' },
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'manipur', label: 'Manipur' },
    { value: 'meghalaya', label: 'Meghalaya' },
    { value: 'mizoram', label: 'Mizoram' },
    { value: 'nagaland', label: 'Nagaland' },
    { value: 'odisha', label: 'Odisha' },
    { value: 'puducherry', label: 'Puducherry' },
    { value: 'punjab', label: 'Punjab' },
    { value: 'rajasthan', label: 'Rajasthan' },
    { value: 'sikkim', label: 'Sikkim' },
    { value: 'tamil_nadu', label: 'Tamil Nadu' },
    { value: 'telangana', label: 'Telangana' },
    { value: 'tripura', label: 'Tripura' },
    { value: 'uttar_pradesh', label: 'Uttar Pradesh' },
    { value: 'uttarakhand', label: 'Uttarakhand' },
    { value: 'west_bengal', label: 'West Bengal' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <FormField
        label="Company Name"
        icon={<Briefcase size={18} />}
        placeholder="Enter company name"
        {...register('companyName')}
        error={errors.companyName?.message}
      />
      
      <FormField
        label="Official Email"
        type="email"
        icon={<Mail size={18} />}
        placeholder="Enter official email"
        {...register('email')}
        error={errors.email?.message}
      />
      
      <FormField
        label="Phone Number"
        type="tel"
        icon={<Phone size={18} />}
        placeholder="Enter phone number"
        {...register('phone')}
        error={errors.phone?.message}
      />
      
      <FormField
        label="Password"
        type="password"
        icon={<Lock size={18} />}
        placeholder="Create a password"
        {...register('password')}
        error={errors.password?.message}
      />
      
      <SelectField
        label="Industry/Sector"
        icon={<Building size={18} />}
        options={industries}
        {...register('industry')}
        error={errors.industry?.message}
      />
      
      <SelectField
        label="Company Location"
        icon={<MapPin size={18} />}
        options={locations}
        {...register('location')}
        error={errors.location?.message}
      />
      
      <div className="flex items-start gap-3 my-4">
        <div className="flex h-5 items-center">
          <input
            id="terms-company"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            {...register('terms')}
          />
        </div>
        <div className="text-sm">
          <label htmlFor="terms-company" className="font-medium text-gray-700">
            I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Use</a>
          </label>
          {errors.terms && <p className="text-xs text-red-500 mt-1">{errors.terms.message}</p>}
        </div>
      </div>
      
      <Button type="submit" className="mt-2">
        Sign Up as Company
      </Button>
    </form>
  );
};
