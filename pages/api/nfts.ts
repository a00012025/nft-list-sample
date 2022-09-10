import { unstable_getServerSession } from 'next-auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAuthOptions } from './auth/[...nextauth]';
import axios from 'axios';

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(
    req,
    res,
    getAuthOptions(req)
  );
  if (!session) {
    res.status(401);
    res.end();
    return;
  }

  const response = await axios.get('https://api.opensea.io/api/v1/assets', {
    params: {
      owner: session.address,
      limit: 50,
    },
    headers: {
      'X-API-KEY': process.env.OPENSEA_API_KEY ?? '',
    },
  });

  if (response.status != 200) {
    res.status(500);
    res.end();
    return;
  }
  res.status(200).send(response.data);
}
