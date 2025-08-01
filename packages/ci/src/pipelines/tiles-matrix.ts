import * as Config from '../config.js'

import * as ConcourseTs from '@decentm/concourse-ts'
import * as AutoPipeline from '@decentm/concourse-ts-recipe-auto-pipeline'
import type * as Git from '@decentm/concourse-ts-resource-git'
import type * as RegistryImage from '@decentm/concourse-ts-resource-registry-image'

import * as DevcontainerTools from '../commands/devcontainer-tools.js'

const registry_image_type = new ConcourseTs.ResourceType('registry_image', (rt) => {
  rt.set_check_every({ hours: 24 })
  rt.set_type('registry-image')

  rt.set_source({
    repository: 'concourse/registry-image-resource',
    tag: '1.13.2-20250730',
  })
})

const devcontainer: RegistryImage.Resource = new ConcourseTs.Resource(
  'devcontainer',
  registry_image_type,
  (r) => {
    r.set_source({
      repository: 'ghcr.io/decentm/project-maps-devcontainer',
      tag: 'latest',
    })
  }
)

const git_type: Git.ResourceType = new ConcourseTs.ResourceType('git', (rt) => {
  rt.set_check_every({ hours: 24 })
  rt.set_type(registry_image_type)

  rt.set_source({
    repository: 'concourse/git-resource',
    tag: '1.17.0-20250129',
  })
})

const git_ci_only: Git.Resource = new ConcourseTs.Resource('git_ci_only', git_type, (r) => {
  r.set_source({
    branch: 'main',
    paths: [Config.package_path],
    uri: 'https://github.com/DecentM/project-maps',
    username: 'concourse',
  })
})

const git_repo_name = 'git_repo'
const git_repo: Git.Resource = new ConcourseTs.Resource(git_repo_name, git_type, (r) => {
  r.set_source({
    branch: 'main',
    uri: 'https://github.com/DecentM/project-maps',
    username: 'concourse',
  })
})

const git_tiles_name = 'git_tiles'
const git_tiles: Git.Resource = new ConcourseTs.Resource(git_tiles_name, git_type, (r) => {
  r.set_source({
    branch: 'main',
    paths: ['packages/map-tiles'],
    uri: 'https://github.com/DecentM/project-maps',
    username: 'concourse',
  })
})

const git_tooling_name = 'git_tooling'
const git_tooling: Git.Resource = new ConcourseTs.Resource(git_tooling_name, git_type, (r) => {
  r.set_source({
    branch: 'main',
    paths: ['.tool-versions'],
    uri: 'https://github.com/DecentM/project-maps',
    username: 'concourse',
  })
})

const pipeline_name = 'tiles-matrix'

type Group = 'ci' | 'matrix'

const auto_pipeline = AutoPipeline.create_auto_pipeline<Group>({
  path: `${Config.output_path}/pipeline/${pipeline_name}.yml`,
  resource: git_ci_only,
  group: 'ci',
})

export default () =>
  new ConcourseTs.Pipeline(
    pipeline_name,
    auto_pipeline((pipeline) => {
      pipeline.add_job(
        new ConcourseTs.Job('tiles-matrix', (job) => {
          // const tooling_step = new ConcourseTs.Task('tooling', (task) => {
          //   task.add_input({
          //     name: git_tooling_name,
          //   })

          //   task.add_output({
          //     name: 'asdf',
          //     path: '/root/.asdf',
          //   })

          //   task.set_platform('linux')
          //   task.set_image_resource(devcontainer)

          //   task.set_run(DevcontainerTools.asdf_install(git_tooling_name))
          // }).as_task_step()

          // job.add_steps(git_tooling.as_get_step({ trigger: true }), tooling_step)

          job.add_steps(
            git_tooling.as_get_step({ trigger: true }),
            git_tiles.as_get_step({ trigger: true }),
            git_repo.as_get_step({ trigger: false }),

            new ConcourseTs.Task('tiles-matrix', (task) => {
              task.add_input(
                {
                  name: git_tiles_name,
                },
                {
                  name: git_tooling_name,
                },
                {
                  name: git_repo_name,
                }
              )

              task.set_platform('linux')
              task.set_image_resource(devcontainer)

              const create_matrix_command = new ConcourseTs.Command((command) => {
                command.set_path('pnpm')

                command.add_args(
                  'tsx',
                  'bin/get-geofabrik-matrix-all.ts',
                  'https://download.geofabrik.de/',
                  '3'
                )
              })

              task.set_run(
                ConcourseTs.Utils.join_commands(
                  (args, command) => {
                    const shell = args.join(' && ')

                    command.set_path('/bin/sh')
                    command.set_dir(`${git_tiles_name}/packages/map-tiles`)

                    command.add_args('-exuc', shell)
                  },
                  DevcontainerTools.asdf_install(git_repo_name),
                  DevcontainerTools.install_dependencies,
                  create_matrix_command
                )
              )
            }).as_task_step()
          )
        }),
        'matrix'
      )
    })
  )
