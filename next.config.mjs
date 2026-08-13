/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Evita que el sitio sea embebido en iframes de otros dominios (clickjacking)
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Evita que el browser "adivine" el tipo de contenido
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Activa protección XSS en browsers viejos
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // No envía el referrer a sitios externos
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Solo permite HTTPS
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          // Permisos de APIs del browser (cámara, micrófono, etc.)
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // API routes: restringir CORS — solo panchoweb puede llamarlas
        source: '/api/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://panchoweb.vercel.app' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
        ],
      },
    ]
  },
}

export default nextConfig
