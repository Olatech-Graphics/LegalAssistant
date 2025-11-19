
import React from 'react';
import type { Lawyer } from '../types';

interface LawyerCardProps {
  lawyer: Lawyer;
}

export const LawyerCard: React.FC<LawyerCardProps> = ({ lawyer }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 transition-shadow hover:shadow-md">
      <h4 className="font-bold text-lg text-blue-800">{lawyer.name}</h4>
      <p className="text-sm text-gray-600">{lawyer.specialization}</p>
      <div className="mt-3 text-sm">
        <p><strong>Location:</strong> {lawyer.location}</p>
        <p><strong>Success Rate:</strong> <span className="font-semibold text-green-700">{lawyer.successRate}</span></p>
        <p><strong>Contact:</strong> <span className="text-blue-600">{lawyer.contact}</span></p>
      </div>
    </div>
  );
};
