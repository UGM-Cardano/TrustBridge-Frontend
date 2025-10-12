import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000';

    const response = await fetch(`${backendUrl}/api/transfer/invoice/${id}`, {
      method: 'GET',
      headers: {
        ...(req.headers.authorization && {
          'Authorization': req.headers.authorization
        }),
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to get invoice' });
    }

    // Get the PDF blob
    const buffer = await response.arrayBuffer();

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="TrustBridge-Invoice-${id}.pdf"`);

    return res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Invoice proxy error:', error);
    return res.status(500).json({
      error: 'Failed to download invoice'
    });
  }
}
