import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { path } = req.query;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000';

    // Reconstruct the path
    const apiPath = Array.isArray(path) ? path.join('/') : path;
    const fullUrl = `${backendUrl}/api/${apiPath}`;

    // Forward query parameters
    const queryString = new URLSearchParams(req.query as any).toString();
    const url = queryString ? `${fullUrl}?${queryString}` : fullUrl;

    // Forward the request to backend
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        // Forward authorization header if present
        ...(req.headers.authorization && {
          'Authorization': req.headers.authorization
        }),
      },
      ...(req.body && ['POST', 'PUT', 'PATCH'].includes(req.method || '') && {
        body: JSON.stringify(req.body),
      }),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('API Proxy error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to connect to backend',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
