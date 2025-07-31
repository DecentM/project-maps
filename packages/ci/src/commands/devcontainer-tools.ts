import * as ConcourseTs from '@decentm/concourse-ts'

export const asdf_install = new ConcourseTs.Command((command) => {
  command.path = '/usr/sbin/asdf'

  command.add_arg('install')
})

export const install_dependencies = new ConcourseTs.Command((command) => {
  command.path = '/root/.asdf/shims/pnpm'

  command.add_arg('install')
  command.add_arg('--frozen-lockfile')
})
