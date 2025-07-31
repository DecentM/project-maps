import * as Config from '../config.js';

import * as ConcourseTs from '@decentm/concourse-ts';
import * as AutoPipeline from '@decentm/concourse-ts-recipe-auto-pipeline';
import * as Git from '@decentm/concourse-ts-resource-git';
import * as RegistryImage from '@decentm/concourse-ts-resource-registry-image';

const registry_image_type: RegistryImage.ResourceType = new ConcourseTs.ResourceType('registry_image', (rt) => {
  rt.set_check_every({ hours: 24 })
  rt.set_type('registry-image')

  rt.source = {
    repository: 'concourse/registry-image-resource',
    tag: '1.13.2-20250730',
  }
})

const devcontainer: RegistryImage.Resource = new ConcourseTs.Resource('devcontainer', registry_image_type, (r) => {
  r.source = {
    repository: 'ghcr.io/decentm/project-maps-devcontainer',
    tag: 'latest',
  }
})

const git_type: Git.ResourceType = new ConcourseTs.ResourceType('git', (rt) => {
  rt.set_check_every({ hours: 24 })
  rt.set_type(registry_image_type as unknown as ConcourseTs.ResourceType)

  rt.source = {
    repository: 'concourse/git-resource',
    tag: '1.17.0-20250129',
  }
})

const git_ci_only: Git.Resource = new ConcourseTs.Resource('git_ci_only', git_type, (r) => {
  r.source = {
    branch: 'main',
    paths: [ Config.output_path ],
    uri: 'https://github.com/DecentM/project-maps',
    username: 'concourse',
  }
})

const git_tiles: Git.Resource = new ConcourseTs.Resource('git', git_type, (r) => {
  r.source = {
    branch: 'main',
    paths: [ 'packages/map-tiles' ],
    uri: 'https://github.com/DecentM/project-maps',
    username: 'concourse',
  }
})

const pipeline_name = 'tiles-matrix';

type Group = 'ci' | 'matrix'

const auto_pipeline = AutoPipeline.create_auto_pipeline<Group>({
  path: `${Config.output_path}/${pipeline_name}.yml`,
  resource: git_ci_only,
  group: 'ci',
})

export default () => new ConcourseTs.Pipeline(pipeline_name, auto_pipeline((pipeline) => {
  pipeline.add_job(new ConcourseTs.Job('tiles-matrix', (job) => {
    job.add_step(
      new ConcourseTs.GetStep('checkout-repo', (get) => {
        get.trigger = true
        get.set_get(git_tiles as unknown as ConcourseTs.Resource)
      })
    )

    job.add_step(
      new ConcourseTs.Task('tiles-matrix', (task) => {
        task.platform = 'linux'
        task.set_image_resource(devcontainer as unknown as ConcourseTs.Resource)

        task.run = new ConcourseTs.Command((command) => {
          command.path = '/bin/sh'
          command.add_arg('-exuc')

          command.dir = 'packages/map-tiles'
          command.add_arg(`pnpm tsx bin/get-geofabrik-matrix.ts https://download.geofabrik.de/ 0 1)`)
        })
      }).as_task_step()
    )
  }), 'matrix')
}))
