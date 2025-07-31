import * as ConcourseTs from '@decentm/concourse-ts'

const asdf_install = new ConcourseTs.Command((command) => {
  command.path = '/usr/sbin/asdf'

  command.add_arg('install')
})

const install_dependencies = new ConcourseTs.Command((command) => {
  command.path = '/root/.asdf/shims/pnpm'

  command.add_arg('install')
  command.add_arg('--frozen-lockfile')
})

export const devcontainer_tools = ConcourseTs.Utils.join_commands((args, command) => {
  const shell = args.join(' && ')

  command.path = '/bin/sh'

  command.add_arg('-exuc')
  command.add_arg(shell)
}, asdf_install, install_dependencies)
