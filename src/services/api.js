import { handleMockPost } from './mockServer';

export async function postApi(endpoint, payload = {}) {
  try {
    const response = await fetch(`/api${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API error ${response.status}`);
    }

    return response.json();
  } catch {
    return handleMockPost(endpoint, payload);
  }
}
