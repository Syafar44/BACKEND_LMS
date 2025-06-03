import axios from 'axios';
import crypto from 'crypto';
import config from './constant';

function getTimestamp() {
  return new Date().toISOString();
}

export default async function executeApi(endpoint : string) {
  const { apiToken, signatureSecret, apiHost } = config();
  const timestamp = getTimestamp();
  if (!signatureSecret) {
    throw new Error('Signature secret is undefined');
  }
  const signature = crypto.createHmac('sha256', signatureSecret).update(timestamp).digest('hex');

  const headers = {
    Authorization: `Bearer ${apiToken}`,
    'X-Api-Timestamp': timestamp,
    'X-Api-Signature': signature,
  };

  const url = apiHost + endpoint;
  const response = await axios.get(url, { headers, validateStatus: () => true });
  const data = response.data;

  if (data.s) return data.d;
  throw new Error(JSON.stringify(data.d));
}