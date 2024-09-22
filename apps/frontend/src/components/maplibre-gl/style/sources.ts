import * as Consts from './consts'

export const sources = {
  openmaptiles: {
    type: 'vector',
    url: Consts.Urls.openmaptilesSource,
  },
} as const
