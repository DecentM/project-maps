export const config = {
  server: {
    host: process.env.BACKEND_HOST || '127.0.0.1',
    port: Number.parseFloat(process.env.BACKEND_PORT || '3000'),
  },
} as const
