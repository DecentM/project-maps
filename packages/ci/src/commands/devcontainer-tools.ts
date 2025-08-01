import * as ConcourseTs from '@decentm/concourse-ts'

export const asdf_install = (dir: string) =>
  new ConcourseTs.Command((command) => {
    if (dir.startsWith('.')) {
      command.set_path(`${dir}/.devcontainer/scripts/post-create.sh`)
    } else {
      command.set_path('.devcontainer/scripts/post-create.sh')
      command.set_dir(dir)
    }
  })

export const install_dependencies = new ConcourseTs.Command((command) => {
  command.set_path('pnpm')

  command.add_args('install', '--frozen-lockfile')
})
