module.exports = (req, res) => {
  // Configurar cabeceras CORS por si acaso
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Responder rápido a las peticiones OPTIONS pre-flight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    let password = '';

    // Manejar body si viene como string o como objeto
    if (typeof req.body === 'string') {
      const parsed = JSON.parse(req.body);
      password = parsed.password;
    } else if (req.body && req.body.password) {
      password = req.body.password;
    }

    const correctPassword = process.env.SITE_PASSWORD;

    if (correctPassword && password === correctPassword) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false, message: 'Clave incorrecta' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
