
import React from 'react';
import type { ContactInfo } from '../types';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { UserIcon, MailIcon, PhoneIcon, GlobeAltIcon, LinkedInIcon, ClipboardIcon, CheckIcon } from './icons';

interface ContactCardProps {
  contact: ContactInfo;
}

const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
}> = ({ icon, label, value }) => {
  const [isCopied, copy] = useCopyToClipboard();

  if (!value) return null;

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
      <div className="flex items-center space-x-3">
        <span className="text-gray-400">{icon}</span>
        <div className="flex flex-col">
           <span className="text-sm text-gray-400">{label}</span>
           <span className="text-gray-100 break-all">{value}</span>
        </div>
      </div>
      <button
        onClick={() => copy(value)}
        className="p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label={`Copy ${label}`}
      >
        {isCopied ? (
          <CheckIcon className="w-5 h-5 text-green-400" />
        ) : (
          <ClipboardIcon className="w-5 h-5 text-gray-400" />
        )}
      </button>
    </div>
  );
};

const ContactCard: React.FC<ContactCardProps> = ({ contact }) => {
  const hasInfo = Object.values(contact).some(v => v !== null);

  if (!hasInfo) {
      return (
        <div className="mt-8 text-center text-gray-400">
            No contact information could be extracted. Please check the provided HTML source.
        </div>
      )
  }

  return (
    <div className="bg-gray-800 shadow-lg rounded-xl p-6 mt-8 w-full max-w-2xl mx-auto border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <UserIcon className="w-6 h-6 mr-2 text-indigo-400" />
        {contact.name || 'Extracted Contact'}
      </h3>
      <div className="space-y-2">
        <InfoRow icon={<LinkedInIcon className="w-6 h-6" />} label="LinkedIn" value={contact.linkedinUrl} />
        <InfoRow icon={<MailIcon className="w-6 h-6" />} label="Email" value={contact.email} />
        <InfoRow icon={<PhoneIcon className="w-6 h-6" />} label="Phone" value={contact.phone} />
        <InfoRow icon={<GlobeAltIcon className="w-6 h-6" />} label="Website" value={contact.website} />
      </div>
    </div>
  );
};

export default ContactCard;
