import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000';

    const response = await fetch(`${backendUrl}/api/transfer/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization && {
          'Authorization': req.headers.authorization
        }),
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Initiate proxy error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to initiate transfer'
    });
  }
}
