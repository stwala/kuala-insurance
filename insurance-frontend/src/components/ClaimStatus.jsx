import React, { useState } from 'react';
import axios from 'axios';
import '../index.css'; // Make sure this is imported

const STATUS_LABELS = {
  PENDING: 'Pending',
  REVIEW: 'Under Review',
  APPROVED: 'Approved (Awaiting Discharge)',
  DENIED: 'Denied',
  DISCHARGED: 'Discharged (check email for confimartion)'
};

const ClaimStatus = () => {
  const [email, setEmail] = useState('');
  const [claims, setClaims] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchClaims = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/claims/?email=${email}`);
      setClaims(response.data);
      setError('');
    } catch (err) {
      setError('Could not fetch claims. Please check the email or try again.');
      setClaims([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Track Your Claims</h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4" // Using your global input styles
        />

        <button
          onClick={fetchClaims}
          className="button"
          disabled={isLoading}
        >
          {isLoading ? 'Searching...' : 'Search Claims'}
        </button>

        {error && <p style={{ color: 'var(--error-color)' }} className="text-center mt-4">{error}</p>}

        {claims.length > 0 && (
          <div className="mt-6">
            {claims.map((claim) => (
              <div key={claim.id} className="card mb-4">
                <p><strong>Claim ID:</strong> {claim.id}</p>
                <p><strong>Name:</strong> {claim.claimant_name}</p>
                <p><strong>Claim Type:</strong> {claim.claim_type}</p>
                <p className="flex items-center gap-2">
                  <strong>Status:</strong>
                  <span className={`status-tag status-${claim.status}`}>
                    {STATUS_LABELS[claim.status] || claim.status}
                  </span>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Submitted: {new Date(claim.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimStatus;