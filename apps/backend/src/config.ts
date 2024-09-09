export const config = {
  server: {
    host: process.env.SERVER_HOST || '127.0.0.1',
    port: Number.parseFloat(process.env.SERVER_PORT || '3000'),
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
