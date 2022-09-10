import axios from 'axios';
import { useState, useEffect } from 'react';
import { Nft } from 'types/nft';

export default function useNfts() {
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [contractAddress, setContractAddress] = useState('');
  const [slug, setSlug] = useState('');

  // useEffect to fetch nfts on mount
  useEffect(() => {
    setLoading(true);
    axios
      .get('/api/nfts', {
        params: {
          contract: contractAddress,
          slug,
        },
      })
      .then((res) => res.data)
      .then((data) => {
        setNfts(
          data.assets.map((asset: any) => {
            const { id, name, image_url, image_preview_url, collection } =
              asset;
            return {
              id,
              name,
              image: image_preview_url ?? image_url,
              collectionName: collection.name,
            };
          })
        );
        setLoading(false);
      });
  }, [contractAddress, slug]);

  return { nfts, loading, setContractAddress, setSlug };
}
