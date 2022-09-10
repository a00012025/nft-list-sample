import { unstable_getServerSession } from 'next-auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAuthOptions } from './auth/[...nextauth]';
import axios from 'axios';

interface OpenseaAssetParams {
  limit: number;
  owner: string;
  asset_contract_address: string | null;
  collection_slug: string | null;
}

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

  const { contract: contractAddress, slug } = req.query;
  const params = {
    owner: session.address,
    limit: 50,
  } as OpenseaAssetParams;
  if (contractAddress && typeof contractAddress === 'string') {
    params.asset_contract_address = contractAddress;
  }
  if (slug && typeof slug === 'string') {
    params.collection_slug = slug;
  }

  const response = await axios.get('https://api.opensea.io/api/v1/assets', {
    params: params,
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
