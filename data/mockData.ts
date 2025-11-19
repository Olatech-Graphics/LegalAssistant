import type { CaseRequest, CaseChatMessage } from '../types';

export const initialCaseRequests: CaseRequest[] = [
  {
    id: 'REQ001',
    userName: 'Rohan Sharma',
    caseSummary: 'Received a traffic challan for jumping a red light in Mumbai. The fine amount seems excessive and I wish to contest it.',
    legalDomain: 'Motor Vehicle Act, 1988',
    urgency: 'Medium',
    status: 'Pending',
    timestamp: '2024-07-28T10:30:00Z',
  },
  {
    id: 'REQ002',
    userName: 'Priya Desai',
    caseSummary: 'My landlord is refusing to return the security deposit after I vacated the flat, citing unreasonable damages.',
    legalDomain: 'Tenancy & Rent Control Law',
    urgency: 'High',
    status: 'Pending',
    timestamp: '2024-07-28T09:15:00Z',
  },
  {
    id: 'REQ003',
    userName: 'Amit Patel',
    caseSummary: 'A newly purchased mobile phone stopped working within a week. The seller is refusing to replace or refund the amount.',
    legalDomain: 'Consumer Protection Act, 2019',
    urgency: 'Low',
    status: 'Accepted',
    timestamp: '2024-07-27T15:00:00Z',
  },
   {
    id: 'REQ004',
    userName: 'Sunita Verma',
    caseSummary: 'Dispute with a neighbor over the construction of a boundary wall that encroaches on my property line.',
    legalDomain: 'Property & Real Estate Law',
    urgency: 'Medium',
    status: 'Rejected',
    timestamp: '2024-07-26T11:45:00Z',
  }
];

export const initialChatHistories: Record<string, CaseChatMessage[]> = {
    'REQ003': [
        {
            id: 'msg1',
            caseId: 'REQ003',
            role: 'advocate',
            text: 'Hello Mr. Patel, I have accepted your case regarding the defective mobile phone. Could you please provide a copy of the purchase receipt?',
            timestamp: '2024-07-27T16:00:00Z',
        },
        {
            id: 'msg2',
            caseId: 'REQ003',
            role: 'citizen',
            text: 'Thank you for taking my case. Yes, I have the receipt. I will send it over shortly.',
            timestamp: '2024-07-27T16:05:00Z',
        }
    ]
};
