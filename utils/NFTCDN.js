import crypto from 'crypto';
import { URLSearchParams } from 'url';
import Blake2b from "blake2b";
import { bech32 } from "bech32";


function tokenImageFromUnit(unit, params = {} ) { 
  if (!unit || unit.length < 57) { 
    return null;
  }
  // Switching to using clg as our NFT CDN provider instead of nftcdn.io
  return 'https://clg.wtf/api/getTokenThumb?unit='+unit;
    /*
    if (!process.env.NFTCDN_KEY) throw new Error("Missing environment variables: NFTCDN_KEY")
    if (!unit || unit.length < 57) { 
      return null;
    }
    params.tk = "";
    const key =  Buffer.from(process.env.NFTCDN_KEY, "base64");    
    const policyId =  Buffer.from(unit.substring(0,56), 'hex');
    const assetName =  Buffer.from(unit.substring(56), 'hex');
    const hashBuf = Blake2b(20)?.update(new Uint8Array([...policyId, ...assetName])).digest("binary");
    const words = bech32.toWords(hashBuf);
    const bech = bech32.encode("asset", words);

    let url = buildUrl(bech, params);
    params.tk = crypto.createHmac("sha256", key)
      .update(url)
      .digest("base64url");
    return buildUrl(bech, params);
    //*/
}

function buildUrl(token, params) {
    if (!process.env.NETWORK) throw new Error("Missing environment variables: NETWORK")

    const uri = "/image";
    let domain = process.env.NETWORK.toLowerCase();
    if (domain === 'mainnet') { 
        domain = process.env.NFTCDN_DOMAIN || 'plutus';
    }
    
    const searchParams = new URLSearchParams(params);
    return `https://${token}.${domain}.nftcdn.io${uri}?${searchParams.toString()}`;
}

export { tokenImageFromUnit };
