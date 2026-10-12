import { Redis } from '@upstash/redis';

// Inicializar el cliente usando las variables de entorno inyectadas por Vercel / Upstash
const redis = Redis.fromEnv();

export default async function handler(req, res) {
  // Configurar cabeceras CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Obtener la biblioteca compartida
  if (req.method === 'GET') {
    try {
      const library = await redis.get('shared_library') || [];
      return res.status(200).json({ library });
    } catch (error) {
      console.error('Error recuperando biblioteca de Upstash Redis:', error);
      return res.status(500).json({ error: 'Error al obtener la biblioteca' });
    }
  }

  // Guardar o actualizar la biblioteca compartida
  if (req.method === 'POST') {
    try {
      const { library } = req.body;
      await redis.set('shared_library', library);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error guardando en Upstash Redis:', error);
      return res.status(500).json({ error: 'Error al guardar la biblioteca' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
