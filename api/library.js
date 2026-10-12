import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      const storage = await redis.get('shared_storage') || {};
      return res.status(200).json({ storage });
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener almacenamiento' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { storage } = req.body;
      await redis.set('shared_storage', storage);
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Error al guardar almacenamiento' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}