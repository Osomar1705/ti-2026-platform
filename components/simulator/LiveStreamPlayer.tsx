import React, { useState, useEffect } from 'react';

// Interfaz para recibir dinámicamente las URLs o nombres de canal
export interface StreamUrls {
  twitch?: string;  // Nombre del canal (Ej: 'dota2ti_es')
  youtube?: string; // ID del canal de YouTube (Ej: 'UCbEhNEf6zVdmd4C61ALvsAw')
  kick?: string;    // Nombre del canal (Ej: 'dotati')
}

interface LiveStreamPlayerProps {
  streamUrls?: StreamUrls;
}

export default function LiveStreamPlayer({ streamUrls }: LiveStreamPlayerProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [activePlatform, setActivePlatform] = useState<'twitch' | 'youtube' | 'kick' | null>(null);
  const [parentDomain, setParentDomain] = useState<string>('localhost');

  // Seleccionar automáticamente la primera plataforma disponible al cargar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setParentDomain(window.location.hostname);
    }

    if (streamUrls?.twitch) setActivePlatform('twitch');
    else if (streamUrls?.youtube) setActivePlatform('youtube');
    else if (streamUrls?.kick) setActivePlatform('kick');
  }, [streamUrls]);

  // Si no hay ninguna transmisión configurada para este partido, no renderizamos nada
  if (!streamUrls || (!streamUrls.twitch && !streamUrls.youtube && !streamUrls.kick)) {
    return null;
  }

  const renderIframe = () => {
    if (!activePlatform) return null;

    const iframeStyle: React.CSSProperties = {
      width: '100%',
      height: '100%',
      border: 'none',
      position: 'absolute',
      top: 0,
      left: 0,
    };

    switch (activePlatform) {
      case 'twitch':
        // Twitch requiere el parámetro 'parent' para funcionar en embebidos
        return (
          <iframe
            src={`https://player.twitch.tv/?channel=${streamUrls.twitch}&parent=${parentDomain}&autoplay=true`}
            allowFullScreen
            style={iframeStyle}
          />
        );
      case 'youtube':
        // Carga siempre el directo activo de un ID de canal
        return (
          <iframe
            src={`https://www.youtube.com/embed/${streamUrls.youtube}?autoplay=1&mute=1&rel=0`}
            allowFullScreen
            style={iframeStyle}
          />
        );
      case 'kick':
        // Kick requiere políticas de sandbox para evitar bloqueos
        return (
          <iframe
            src={`https://player.kick.com/${streamUrls.kick}`}
            sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
            allowFullScreen
            style={iframeStyle}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ width: '100%', marginBottom: '16px', background: '#111', borderRadius: '8px', overflow: 'hidden' }}>
      {/* Botón para expandir / colapsar */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        style={{
          width: '100%',
          padding: '12px',
          background: '#1a1a1a',
          color: '#d4af37', // Color dorado UI
          border: 'none',
          borderBottom: isVisible ? '1px solid #333' : 'none',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '14px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        {isVisible ? 'Ocultar Transmisión ▲' : 'Ver Transmisión en Vivo ▼'}
      </button>

      {/* Contenedor del Stream (Pestañas + Video) */}
      {isVisible && (
        <div>
          {/* Selector de Plataformas (Tabs) */}
          <div style={{ display: 'flex', background: '#0a0a0a', padding: '8px', gap: '8px' }}>
            {streamUrls.twitch && (
              <button
                onClick={() => setActivePlatform('twitch')}
                style={getTabStyle(activePlatform === 'twitch', '#9146FF')}
              >
                📺 Twitch
              </button>
            )}
            {streamUrls.youtube && (
              <button
                onClick={() => setActivePlatform('youtube')}
                style={getTabStyle(activePlatform === 'youtube', '#FF0000')}
              >
                📺 YouTube
              </button>
            )}
            {streamUrls.kick && (
              <button
                onClick={() => setActivePlatform('kick')}
                style={getTabStyle(activePlatform === 'kick', '#53FC18')}
              >
                📺 Kick
              </button>
            )}
          </div>

          {/* Reproductor de Video 16:9 */}
          <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000' }}>
            {renderIframe()}
          </div>
        </div>
      )}
    </div>
  );
}

// Función auxiliar para los estilos de las pestañas
function getTabStyle(isActive: boolean, brandColor: string): React.CSSProperties {
  return {
    padding: '6px 12px',
    background: isActive ? brandColor + '22' : 'transparent',
    color: isActive ? brandColor : '#888',
    border: `1px solid ${isActive ? brandColor : '#333'}`,
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: isActive ? 'bold' : 'normal',
    transition: 'all 0.2s ease',
  };
}
