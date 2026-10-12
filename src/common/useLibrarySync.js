import { useEffect } from 'react';

export function useLibrarySync() {
  useEffect(() => {
    // 1. Al cargar la app, descargar la biblioteca compartida de Redis
    fetch('/api/library')
      .then((res) => res.json())
      .then((data) => {
        if (data.library && Array.isArray(data.library) && data.library.length > 0) {
          const currentLocal = JSON.parse(localStorage.getItem('stremio_library') || '[]');
          // Si Redis tiene datos más recientes o locales vacíos, actualizamos el almacenamiento local
          if (JSON.stringify(currentLocal) !== JSON.stringify(data.library)) {
            localStorage.setItem('stremio_library', JSON.stringify(data.library));
            window.dispatchEvent(new Event('storage')); // Notificar cambio a React
          }
        }
      })
      .catch((err) => console.error('Error al sincronizar biblioteca desde Redis:', err));

    // 2. Escuchar cambios locales para subirlos a Redis en tiempo real
    const handleSyncToRemote = () => {
      const currentLocal = JSON.parse(localStorage.getItem('stremio_library') || '[]');
      fetch('/api/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ library: currentLocal }),
      }).catch((err) => console.error('Error al subir biblioteca a Redis:', err));
    };

    window.addEventListener('storage', handleSyncToRemote);
    return () => window.removeEventListener('storage', handleSyncToRemote);
  }, []);
}
