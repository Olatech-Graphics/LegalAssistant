import React, { useState } from 'react';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';
import { useTranslations } from '../hooks/useTranslations';

type CaseTypeKey = 'consumer' | 'property' | 'family' | 'cheque' | 'otherCivil';

const portalLinks: Record<CaseTypeKey, { name: string; url: string }[]> = {
  consumer: [
    { name: 'National Consumer Helpline', url: 'https://consumerhelpline.gov.in/' },
    { name: 'E-Daakhil Portal', url: 'https://edaakhil.nic.in/' },
  ],
  property: [
    { name: 'e-Courts Services', url: 'https://ecourts.gov.in/ecourts_home/' },
    { name: 'National Generic Document Registration System', url: 'https://ngdrs.gov.in/' },
  ],
  family: [
    { name: 'e-Courts Services', url: 'https://ecourts.gov.in/ecourts_home/' },
  ],
  cheque: [
    { name: 'e-Courts Services for Negotiable Instruments Act', url: 'https://ecourts.gov.in/ecourts_home/' },
  ],
  otherCivil: [
    { name: 'e-Courts Services', url: 'https://ecourts.gov.in/ecourts_home/' },
  ]
};

export const CaseFiling: React.FC = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        phone: '',
        email: '',
        caseType: '',
    });
    const [formSubmitted, setFormSubmitted] = useState(false);
    const t = useTranslations().caseFiling;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitted(true);
    };
    
    const linksToShow = portalLinks[formData.caseType as CaseTypeKey] || [];

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-3xl font-bold text-[rgb(var(--foreground))]">{t.title}</h1>
            </div>
            <p className="text-lg text-[rgb(var(--muted-foreground))] mb-6">{t.description}</p>
            
            <div className="bg-[rgb(var(--card))] p-6 sm:p-8 rounded-xl shadow-custom-lg border border-[rgb(var(--border))]">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-[rgb(var(--card-foreground))]">{t.fullNameLabel}</label>
                            <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleInputChange} placeholder={t.fullNamePlaceholder} className="mt-1 block w-full p-2 border border-[rgb(var(--border))] rounded-md bg-[rgb(var(--background))] focus:ring-2 focus:ring-[rgb(var(--ring))]" required />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-[rgb(var(--card-foreground))]">{t.phoneLabel}</label>
                            <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-[rgb(var(--border))] rounded-md bg-[rgb(var(--background))] focus:ring-2 focus:ring-[rgb(var(--ring))]" required />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="address" className="block text-sm font-medium text-[rgb(var(--card-foreground))]">{t.addressLabel}</label>
                        <textarea name="address" id="address" value={formData.address} onChange={handleInputChange} rows={3} placeholder={t.addressPlaceholder} className="mt-1 block w-full p-2 border border-[rgb(var(--border))] rounded-md bg-[rgb(var(--background))] focus:ring-2 focus:ring-[rgb(var(--ring))]" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[rgb(var(--card-foreground))]">{t.emailLabel}</label>
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} placeholder={t.emailPlaceholder} className="mt-1 block w-full p-2 border border-[rgb(var(--border))] rounded-md bg-[rgb(var(--background))] focus:ring-2 focus:ring-[rgb(var(--ring))]" required />
                        </div>
                        <div>
                            <label htmlFor="caseType" className="block text-sm font-medium text-[rgb(var(--card-foreground))]">{t.caseTypeLabel}</label>
                            <select name="caseType" id="caseType" value={formData.caseType} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-[rgb(var(--border))] rounded-md bg-[rgb(var(--background))] focus:ring-2 focus:ring-[rgb(var(--ring))]" required>
                                <option value="">{t.caseTypeDefault}</option>
                                {Object.entries(t.caseTypes).map(([key, value]) => (
                                    <option key={key} value={key}>{value}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--accent))] text-[rgb(var(--primary-foreground))] font-semibold rounded-md hover:opacity-90 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow-md">
                            {t.submitButton}
                        </button>
                    </div>
                </form>

                {formSubmitted && (
                    <div className="mt-8 pt-6 border-t border-[rgb(var(--border))]">
                        <h2 className="text-2xl font-semibold text-[rgb(var(--card-foreground))]">{t.formSubmittedTitle}</h2>
                        <p className="text-[rgb(var(--muted-foreground))] mt-2 mb-4">{t.formSubmittedDescription}</p>
                        
                        <div className="space-y-3">
                            {linksToShow.length > 0 ? (
                                linksToShow.map(link => (
                                    <a
                                        key={link.name}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-4 bg-[rgb(var(--muted))] rounded-lg border border-[rgb(var(--border))] hover:border-[rgb(var(--primary))] transition-colors"
                                    >
                                        <span className="font-semibold text-[rgb(var(--primary))]">{link.name}</span>
                                        <ExternalLinkIcon className="w-5 h-5 text-[rgb(var(--muted-foreground))]" />
                                    </a>
                                ))
                            ) : (
                                <p className="text-center text-[rgb(var(--muted-foreground))] p-4 bg-[rgb(var(--muted))] rounded-lg">{t.noLinks}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};