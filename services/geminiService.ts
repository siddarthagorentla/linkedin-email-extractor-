
import type { ContactInfo, GroundingChunk } from '../types';

export async function extractContactInfoFromUrl(profileUrl: string): Promise<{ contactInfo: ContactInfo, sources: GroundingChunk[] }> {
  try {
    const response = await fetch('/api/extract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ profileUrl }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An error occurred on the server.');
    }

    return await response.json();

  } catch (error) {
    console.error("Error calling backend API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get contact information. Reason: ${error.message}`);
    }
    throw new Error("An unknown error occurred while processing the request.");
  }
}
