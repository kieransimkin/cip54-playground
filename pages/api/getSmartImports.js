import { init, getSmartImports } from "libcip54"
import pgClient from "../../utils/dbsync";
import {getClient} from "../../utils/redis";

export default async function Browse(req, res) {
  const redisClient = await getClient();
    init(process.env.NETWORK?.toLowerCase(), pgClient, null, null, redisClient);
    const {metadata, walletAddr} = req.body;
    const featureTree = metadata?.uses;
    const mockTokenUnit = 'Un-minted'

    const ret = await getSmartImports(featureTree, metadata, walletAddr, mockTokenUnit);

    res.status(200).json(ret);
}

export const config = {
    api: {
      responseLimit: false,
    },
  }