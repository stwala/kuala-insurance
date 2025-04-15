// src/components/ClaimForm.jsx
import { useState } from 'react';
import axios from 'axios';

export default function ClaimForm() {
  const [form, setForm] = useState({
    claim_type: '',
    claimant_name: '',
    email: '',
    phone_number: '',
    description: '',
    document: null,
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [generalError, setGeneralError] = useState(null);

  const claimTypes = [
    { value: 'HEALTH', label: 'Health' },
    { value: 'VEHICLE', label: 'Vehicle' },
    { value: 'PROPERTY', label: 'Property' },
    { value: 'LIFE', label: 'Life' },
    { value: 'TRAVEL', label: 'Travel' },
  ];

  const handleChange = e => {
    const { name, value, files } = e.target;

    if (name === 'phone_number') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 9);
      setForm(prev => ({ ...prev, [name]: digitsOnly }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: files ? files[0] : value,
      }));
    }

    // Clear error for that field
    setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setGeneralError(null);
    setErrors({});

    if (form.phone_number.length !== 9) {
      setErrors(prev => ({
        ...prev,
        phone_number: 'Phone number must be exactly 9 digits.',
      }));
      return;
    }

    const data = new FormData();
    for (let key in form) {
      data.append(key, form[key]);
    }

    data.append('full_phone_number', `+260${form.phone_number}`);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/claims/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201 || response.status === 200) {
        setSuccess(true);
        setForm({
          claim_type: '',
          claimant_name: '',
          email: '',
          phone_number: '',
          description: '',
          document: null,
        });
      }
    } catch (err) {
      if (err.response && err.response.data) {
        const serverErrors = err.response.data;
        setErrors(serverErrors);
        setGeneralError(serverErrors.message || 'Please fix the highlighted errors.');
      } else {
        setGeneralError('Network error. Please try again later.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">Submit Insurance Claim</h2>

      {success && (
        <div className="mb-4 p-4 text-green-800 bg-green-100 border border-green-300 rounded-md shadow-md">
          🎉 <strong>Success:</strong> Your claim has been submitted!
        </div>
      )}

      {generalError && (
        <div className="mb-4 p-4 text-red-800 bg-red-100 border border-red-300 rounded-md">
          ⚠️ <strong>Error:</strong> {generalError}
        </div>
      )}

      <div className="mb-4">
        <label className="block font-medium">Claim Type</label>
        <select
          name="claim_type"
          value={form.claim_type}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Select a type</option>
          {claimTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
        {errors.claim_type && <p className="text-red-600 text-sm mt-1">{errors.claim_type}</p>}
      </div>

      <div className="mb-4">
        <label className="block font-medium">Claimant Name</label>
        <input
          type="text"
          name="claimant_name"
          value={form.claimant_name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        {errors.claimant_name && <p className="text-red-600 text-sm mt-1">{errors.claimant_name}</p>}
      </div>

      <div className="mb-4">
        <label className="block font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
      </div>

      <div className="mb-4">
        <label className="block font-medium">Phone Number</label>
        <div className="flex">
          <span className="inline-flex items-center px-3 border border-r-0 rounded-l bg-gray-100">
            +260
          </span>
          <input
            type="tel"
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            className="w-full border p-2 rounded-r"
            placeholder="97XXXXXXX"
            maxLength={9}
            pattern="[0-9]{9}"
            required
          />
        </div>
        {errors.phone_number && <p className="text-red-600 text-sm mt-1">{errors.phone_number}</p>}
      </div>

      <div className="mb-4">
        <label className="block font-medium">Incident Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          rows={4}
          required
        ></textarea>
        {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
      </div>

      <div className="mb-6">
        <label className="block font-medium">Supporting Document</label>
        <input
          type="file"
          name="document"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          accept=".pdf,.jpg,.jpeg,.png"
          required
        />
        <p className="text-sm text-gray-500 mt-1">Upload PDF, JPG, or PNG files (max 5MB)</p>
        {errors.document && <p className="text-red-600 text-sm mt-1">{errors.document}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 transition-colors"
      >
        Submit Claim
      </button>
    </form>
  );
}
