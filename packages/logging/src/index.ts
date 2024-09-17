import pino from 'pino'

export const log = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.LOG_PRETTY === 'true' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'hostname,pid',
    },
  } : undefined,
})
