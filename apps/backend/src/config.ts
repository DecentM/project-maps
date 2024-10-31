export const config = {
  server: {
    host: process.env.BACKEND_HOST || '127.0.0.1',
    port: Number.parseFloat(process.env.BACKEND_PORT || '3000'),
  },

  rpc: {
    clients: {
      metadata: {
        host: process.env.GRPC_METADATA_HOST || '127.0.0.1',
        port: Number.parseFloat(process.env.GRPC_METADATA_PORT || '50051'),
      },
    },
  }
} as const
