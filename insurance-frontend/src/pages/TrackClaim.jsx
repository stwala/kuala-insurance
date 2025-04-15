import React from 'react';
import ClaimStatus from '../components/ClaimStatus'; // adjust path if needed

const TrackClaimPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-center text-3xl font-bold mb-6">Track Your Claim</h1>
      <ClaimStatus />
    </div>
  );
};

export default TrackClaimPage;
