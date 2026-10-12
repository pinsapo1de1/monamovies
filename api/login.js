export default function handler(req, res) {
  // Permitir únicamente peticiones de tipo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  // Extraer la contraseña asegurando el parseo
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }

  const { password } = body || {};
  const correctPassword = process.env.SITE_PASSWORD;

  // Comprobar que existe la variable y coincide la clave
  if (correctPassword && password === correctPassword) {
    return res.status(200).json({ success: true, message: 'Acceso concedido' });
  } else {
    return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
  }
}
