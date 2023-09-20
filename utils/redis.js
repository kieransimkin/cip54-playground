import dotenv from 'dotenv';
dotenv.config()
import {createClient} from 'redis';
let client = null;
export const getClient = async() => { 
    if (!client) { 
        client = await createClient({url: process.env.REDIS_URI});
        await client.connect();
    }
    return client;
}