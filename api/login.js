export default function handler(req, res) {
  // Solo permitimos peticiones de tipo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { password } = req.body || {};
  const correctPassword = process.env.SITE_PASSWORD; // Lee la clave desde las variables de Vercel

  if (password && password === correctPassword) {
    // Si coincide, devuelve éxito
    return res.status(200).json({ success: true, message: 'Acceso concedido' });
  } else {
    // Si no coincide, devuelve error
    return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
  }
}
