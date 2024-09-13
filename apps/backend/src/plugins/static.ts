import path from 'node:path'
import fp from 'fastify-plugin'
import Static from '@fastify/static'

export default fp(async (fastify, opts) => {
  fastify.register(Static, {
    root: path.resolve(import.meta.dirname, '..', 'static', 'map-tiles'),
    decorateReply: false,
    prefix: '/tile',
    allowedPath(pathName, root, request) {
      if (pathName === '/metadata.json') return true

      return pathName.endsWith('.pbf') && !pathName.includes('..')
    },
    setHeaders(res, pathName, stat) {
      if (pathName.endsWith('.json')) {
        res.setHeader('Content-Type', 'application/json')
      } else {
        res.setHeader('Content-Type', 'application/x-protobuf')
        res.setHeader('Content-Encoding', 'gzip')
      }
    },
  })

  fastify.register(Static, {
    root: path.resolve(import.meta.dirname, '..', 'static', 'map-fonts'),
    decorateReply: false,
    prefix: '/fonts',
    allowedPath(pathName, root, request) {
      return pathName.endsWith('.pbf') && !pathName.includes('..')
    },
    setHeaders(res, pathName, stat) {
      res.setHeader('Content-Type', 'application/x-protobuf')
    },
  })

  fastify.register(Static, {
    root: path.resolve(import.meta.dirname, '..', 'static', 'map-style'),
    decorateReply: false,
    prefix: '/styles',
    allowedPath(pathName, root, request) {
      return (pathName.endsWith('.json') || pathName.endsWith('.png')) && !pathName.includes('..')
    },
    setHeaders(res, pathName, stat) {
      if (pathName.endsWith('.json')) {
        res.setHeader('Content-Type', 'application/json')
      } else {
        res.setHeader('Content-Type', 'image/png')
      }
    },
  })

  fastify.register(Static, {
    root: path.resolve(import.meta.dirname, '..', 'static', 'map-icons'),
    decorateReply: false,
    prefix: '/icons',
    allowedPath(pathName, root, request) {
      return (pathName.endsWith('.svg') || pathName.endsWith('.png') || pathName.endsWith('.json')) && !pathName.includes('..')
    },
    setHeaders(res, pathName, stat) {
      if (pathName.endsWith('.svg')) {
        res.setHeader('Content-Type', 'image/svg+xml')
      }

      if (pathName.endsWith('.png')) {
        res.setHeader('Content-Type', 'image/png')
      }

      if (pathName.endsWith('.json')) {
        res.setHeader('Content-Type', 'application/json')
      }
    },
  })
})
