import { Locked } from '@project-maps/proto/lib/openstreetmap/node'

export const parseLocked = (locked?: string | null, locked_conditional?: string | null): Locked => {
  if (locked === 'yes') {
    return Locked.fromObject({
      value: true,
    })
  }

  return Locked.fromObject({
    value: false,
    conditional: locked_conditional ? locked_conditional : undefined,
  })
}
