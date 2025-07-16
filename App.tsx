
import React, { useState, useCallback } from 'react';
import type { ContactInfo, GroundingChunk } from './types';
import { extractContactInfoFromUrl } from './services/geminiService';
import ContactCard from './components/ContactCard';
import Loader from './components/Loader';
import { DownloadIcon, SparklesIcon } from './components/icons';

const App: React.FC = () => {
  const [profileUrl, setProfileUrl] = useState('');
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!profileUrl.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setContacts([]);
    setSources([]);

    try {
      const { contactInfo, sources: newSources } = await extractContactInfoFromUrl(profileUrl);
      setContacts(contactInfo ? [contactInfo] : []);
      setSources(newSources || []);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [profileUrl, isLoading]);

  const handleDownloadCsv = () => {
      if (contacts.length === 0) return;

      const headers = ['name', 'email', 'phone', 'website', 'linkedinUrl'];
      const csvRows = [
          headers.join(','),
          ...contacts.map(contact => 
              headers.map(header => `"${contact[header as keyof ContactInfo] || ''}"`).join(',')
          )
      ];

      const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      const fileName = contacts[0]?.name ? `${contacts[0].name.replace(/\s+/g, '_')}_contact.csv` : 'contacts.csv';
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };
  
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return url.includes('linkedin.com/in/');
    } catch (_) {
      return false;
    }
  }


  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-4xl flex flex-col items-center">
        <header className="text-center my-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            LinkedIn Profile Extractor AI
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl">
            Paste a LinkedIn profile URL to instantly find public contact details using AI-powered web search.
          </p>
        </header>
        
        <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-xl">
          <input
            type="url"
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
            placeholder="https://www.linkedin.com/in/username"
            className="w-full p-4 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-gray-300"
            disabled={isLoading}
            aria-label="LinkedIn Profile URL"
          />
          <button
            type="submit"
            disabled={isLoading || !isValidUrl(profileUrl)}
            className="mt-4 w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
          >
            {isLoading ? (
              'Analyzing...'
            ) : (
              <>
                <SparklesIcon className="w-5 h-5 mr-2" />
                Extract Information
              </>
            )}
          </button>
        </form>

        <div className="w-full mt-8">
          {isLoading && <Loader />}
          {error && <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-md">{error}</div>}
          
          {!isLoading && contacts.length > 0 && (
            <div className="flex flex-col items-center w-full">
                {contacts.map((contact, index) => (
                    <ContactCard key={index} contact={contact} />
                ))}
               
                {sources.length > 0 && (
                  <div className="w-full max-w-2xl mx-auto mt-6 bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-gray-300">Sources Found by AI:</h4>
                    <ul className="list-disc list-inside mt-2 space-y-2 text-sm">
                      {sources.map((source, index) => (
                        <li key={index} className="truncate">
                          <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline" title={source.web.title}>
                            {source.web.title || source.web.uri}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                    onClick={handleDownloadCsv}
                    className="mt-6 flex items-center justify-center bg-green-600 text-white font-bold py-2 px-6 rounded-md hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500"
                >
                    <DownloadIcon className="w-5 h-5 mr-2" />
                    Download as CSV
                </button>
            </div>
          )}
        </div>
      </main>

      <footer className="w-full max-w-4xl text-center mt-auto pt-8">
         <p className="text-xs text-gray-600">
           Disclaimer: This tool is for educational and personal use only. It uses AI to search for publicly available information and does not scrape websites directly.
           Ensure your use complies with all applicable laws and terms of service.
         </p>
      </footer>
    </div>
  );
};

export default App;
