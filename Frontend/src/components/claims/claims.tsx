'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Claim {
  claim_id: number;
  service_name: string;
  provider_name: string;
  claim_amount: number;
  service_date: string;
  submission_date: string;
  approval_date: string | null;
  claim_status: 'Pending' | 'Approved' | 'Rejected';
}

interface FormData {
  service_id: string;
  provider_id: string;
  claim_amount: number;
  service_date: string;
  submission_date: string;
  approval_date: string;
  claim_status: 'Pending' | 'Approved' | 'Rejected';
}

interface Service {
  service_id: number;
  service_name: string;
}

interface Provider {
  provider_id: number;
  provider_name: string;
}

export default function ClaimComponent() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState<FormData>({
    service_id: '',
    provider_id: '',
    claim_amount: 0,
    service_date: new Date().toISOString().split('T')[0],
    submission_date: new Date().toISOString().split('T')[0],
    approval_date: '',
    claim_status: 'Pending',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchClaims(), fetchServices(), fetchProviders()]);
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
        setError('Failed to load initial data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const fetchClaims = async () => {
    try {
      const response = await axios.get('/api/db/claims');
      if (response.data && response.data.data) {
        const formattedClaims = response.data.data.map((claim: any) => ({
          ...claim,
          service_name: claim.service?.service_name || 'Unknown Service',
          provider_name: claim.provider?.provider_name || 'Unknown Provider',
        }));
        setClaims(formattedClaims);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching claims:', err);
      throw err; // Re-throw to be caught by the parent function
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get('/api/db/services');
      setServices(response.data);
    } catch (err) {
      console.error('Error fetching services:', err);
      throw err;
    }
  };

  const fetchProviders = async () => {
    try {
      const response = await axios.get('/api/db/providers');
      setProviders(response.data);
    } catch (err) {
      console.error('Error fetching providers:', err);
      throw err;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle numeric inputs separately to ensure proper type conversion
    if (type === 'number') {
      setFormData({ 
        ...formData, 
        [name]: value === '' ? 0 : parseFloat(value) 
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Validate form data
      if (!formData.service_id || !formData.provider_id || formData.claim_amount <= 0) {
        throw new Error('Please fill in all required fields with valid values.');
      }
      
      await axios.post('/api/db/claims', formData);
      await fetchClaims();
      setIsFormOpen(false);
      resetForm();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to submit claim.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      service_id: '',
      provider_id: '',
      claim_amount: 0,
      service_date: new Date().toISOString().split('T')[0],
      submission_date: new Date().toISOString().split('T')[0],
      approval_date: '',
      claim_status: 'Pending',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-800';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };

  const filteredClaims = claims
    .filter((claim) => filterStatus === 'all' || claim.claim_status === filterStatus)
    .filter((claim) => 
      searchTerm === '' || 
      claim.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.provider_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const toggleForm = () => {
    if (isFormOpen) {
      resetForm();
    }
    setIsFormOpen(prevState => !prevState);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="bg-transparent text-slate-700 z-20">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-slate-100">
          {/* Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-indigo-600 to-blue-500">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Claims Management</h1>
            <button 
              onClick={toggleForm}
              className="px-5 py-2 rounded-lg text-white  bg-white/20"
            >
              {isFormOpen ? 'Cancel' : '+ New Claim'}
            </button>
          </div>
        </div>

          {/* Notification for errors */}
          {error && (
            <div className="bg-rose-50 border-l-4 border-rose-500 p-4 m-6">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm text-rose-700">{error}</p>
                </div>
                <button 
                  className="ml-auto text-rose-500"
                  onClick={() => setError(null)}
                  type="button"
                  aria-label="Close error message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* New Claim Form */}
          {isFormOpen && (
            <div className="px-8 py-6 text-slate-700 bg-slate-50 border-b border-slate-200">
              <h2 className="text-lg font-medium text-slate-800 mb-5">Submit New Claim</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="service_id" className="block text-sm font-medium text-slate-700 mb-2">Service</label>
                  <select 
                    id="service_id"
                    name="service_id" 
                    value={formData.service_id} 
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition"
                    required
                  >
                    <option value="">Select Service</option>
                    {services.map((service) => (
                      <option key={service.service_id} value={service.service_id}>
                        {service.service_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="provider_id" className="block text-sm font-medium text-slate-700 mb-2">Provider</label>
                  <select 
                    id="provider_id"
                    name="provider_id" 
                    value={formData.provider_id} 
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition"
                    required
                  >
                    <option value="">Select Provider</option>
                    {providers.map((provider) => (
                      <option key={provider.provider_id} value={provider.provider_id}>
                        {provider.provider_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="claim_amount" className="block text-sm font-medium text-slate-700 mb-2">Claim Amount ($)</label>
                  <input
                    id="claim_amount"
                    type="number"
                    name="claim_amount"
                    value={formData.claim_amount}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition"
                    required
                    min="0.01"
                    step="0.01"
                  />
                </div>

                <div>
                  <label htmlFor="service_date" className="block text-sm font-medium text-slate-700 mb-2">Service Date</label>
                  <input
                    id="service_date"
                    type="date"
                    name="service_date"
                    value={formData.service_date}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition"
                    required
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="col-span-1 md:col-span-3 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                  >
                    {submitting ? 'Submitting...' : 'Submit Claim'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search and Filter Controls */}
          <div className="px-8 py-5 bg-white border-b border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-2">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="search"
                    type="text"
                    placeholder="Search by service or provider..."
                    className="w-full pl-10 px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-slate-700 mb-2">Filter by Status</label>
                <select 
                  id="status-filter"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Claims Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
              </div>
            ) : filteredClaims.length === 0 ? (
              <div className="text-center py-16">
                <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="mt-4 text-slate-500 text-lg">No claims found matching your criteria.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Service</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Provider</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount ($)</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Service Date</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {filteredClaims.map((claim) => (
                    <tr key={claim.claim_id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{claim.service_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{claim.provider_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">{formatCurrency(claim.claim_amount)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                        {new Date(claim.service_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.claim_status)}`}>
                          {claim.claim_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="bg-white px-8 py-4 flex items-center justify-between border-t border-slate-200">
            <div className="flex-1 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">
                  Showing <span className="font-medium">{filteredClaims.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button 
                    type="button" 
                    className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 transition"
                    disabled={true}
                    aria-label="Previous page"
                  >
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button 
                    type="button" 
                    className="relative inline-flex items-center px-4 py-2 border border-slate-300 bg-indigo-50 text-sm font-medium text-indigo-600"
                    aria-current="page"
                  >
                    1
                  </button>
                  <button 
                    type="button" 
                    className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 transition"
                    disabled={true}
                    aria-label="Next page"
                  >
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}