'use client';

import { useState } from 'react';
import { signUpNewUser } from '@/utils/auth-helpers/auth';

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    // Member information
    member_name: '',
    member_email: '',
    password: '',
    phone_number: '',
    address: '',
    date_of_birth: '',
    gender: '',
    member_effective_start_date: '',
    member_effective_end_date: '',
    
    // Dependent information
    dependent_name: '',
    dependent_address: '',
    dependent_contact: '',
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const error: any = await signUpNewUser(formData);
    
    if (error) {
      setError(error);
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Progress bar percentage calculation
  const progressPercentage = ((currentStep - 1) / 2) * 100;

  return (
    <div className="min-h-screen text-slate-700  py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100 backdrop-blur-sm bg-opacity-80">
          <div className="px-8 py-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <h1 className="text-3xl font-bold">Create your account</h1>
            <p className="mt-2 opacity-90">Complete the steps below to register</p>
            
            {/* Step indicator */}
            <div className="mt-6 flex items-center">
              <div className="relative w-full bg-blue-300 bg-opacity-30 rounded-full h-2 overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-white transition-all duration-300 ease-in-out" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <span className="ml-4 text-white font-medium">Step {currentStep}/3</span>
            </div>
          </div>
          
          {/* Steps navigation */}
          <div className="flex">
            {['Personal Information', 'Membership Details', 'Dependent Information'].map((step, index) => (
              <button
                key={step}
                className={`flex-1 text-center py-4 px-2 transition-all duration-200 ${
                  currentStep === index + 1 
                    ? 'border-b-2 border-blue-600 text-blue-600 font-medium' 
                    : 'text-gray-500 hover:text-gray-700'
                } ${index + 1 <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                onClick={() => index + 1 <= currentStep && setCurrentStep(index + 1)}
                disabled={index + 1 > currentStep}
              >
                <span className="hidden sm:inline">{step}</span>
                <span className="sm:hidden">{index + 1}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSignUp} className="p-6 sm:p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm animate-pulse">
                <p>{error}</p>
              </div>
            )}
            
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h2>
                
                <div>
                  <label htmlFor="member_name" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Full Name</label>
                  <input
                    id="member_name"
                    name="member_name"
                    type="text"
                    required
                    value={formData.member_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 bg-opacity-50"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="member_email" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Email Address</label>
                  <input
                    id="member_email"
                    name="member_email"
                    type="email"
                    required
                    value={formData.member_email}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 bg-opacity-50"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 bg-opacity-50"
                    placeholder="Create a secure password"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Phone Number</label>
                  <input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 bg-opacity-50"
                    placeholder="Your phone number"
                  />
                </div>
                
                <div className="pt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-blue-200 transition duration-300 flex items-center justify-center transform hover:-translate-y-1"
                  >
                    Continue 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 2: Membership Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Membership Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Date of Birth</label>
                    <input
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 bg-opacity-50"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 bg-opacity-50"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Address</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 bg-opacity-50"
                    placeholder="Your current address"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="member_effective_start_date" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Membership Start Date</label>
                    <input
                      id="member_effective_start_date"
                      name="member_effective_start_date"
                      type="date"
                      value={formData.member_effective_start_date}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 bg-opacity-50"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="member_effective_end_date" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Membership End Date</label>
                    <input
                      id="member_effective_end_date"
                      name="member_effective_end_date"
                      type="date"
                      value={formData.member_effective_end_date}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 bg-opacity-50"
                    />
                  </div>
                </div>
                
                <div className="pt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition duration-300 flex items-center justify-center border border-gray-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-blue-200 transition duration-300 flex items-center justify-center transform hover:-translate-y-1"
                  >
                    Continue
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 3: Dependent Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Dependent Information</h2>
                <p className="text-gray-600 mb-6 text-sm">Please provide information about your dependent if applicable, or leave blank to skip.</p>
                
                <div>
                  <label htmlFor="dependent_name" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Dependent Name</label>
                  <input
                    id="dependent_name"
                    name="dependent_name"
                    type="text"
                    value={formData.dependent_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 bg-opacity-50"
                    placeholder="Full name of dependent"
                  />
                </div>
                
                <div>
                  <label htmlFor="dependent_address" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Dependent Address</label>
                  <input
                    id="dependent_address"
                    name="dependent_address"
                    type="text"
                    value={formData.dependent_address}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 bg-opacity-50"
                    placeholder="Address of dependent"
                  />
                </div>
                <div>
                  <label htmlFor="dependent_contact" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Dependent Contact</label>
                  <input
                    id="dependent_contact"
                    name="dependent_contact"
                    type="tel"
                    value={formData.dependent_contact}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 bg-opacity-50"
                    placeholder="Contact number of dependent"
                  />
                </div>

                <div className="pt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition duration-300 flex items-center justify-center border border-gray-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3.5 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium rounded-xl shadow-lg shadow-green-200 transition duration-300 flex items-center justify-center transform hover:-translate-y-1 disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}
