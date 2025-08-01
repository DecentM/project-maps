import type * as ConcourseTs from '@decentm/concourse-ts'

export const chown =
  (...args: string[]): ConcourseTs.Type.Customiser<ConcourseTs.Command> =>
  (command) => {
    command.set_path('/usr/bin/chown')
    command.add_args(...args)
    command.set_user('root')
  }
