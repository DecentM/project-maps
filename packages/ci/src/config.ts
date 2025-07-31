import * as ConcourseTs from '@decentm/concourse-ts';

ConcourseTs.Pipeline.customise((pipeline) => {
  pipeline.set_background_image_url('https://bing.biturl.top/?resolution=1920&format=image')
})

ConcourseTs.Job.customise((job) => {
  job.build_log_retention = {
    builds: 15,
    days: 30,
    minimum_succeeded_builds: 5,
  }

  job.max_in_flight = 2
  job.interruptible = true
  job.public = false
})

ConcourseTs.Resource.customise((resource) => {
  resource.set_check_every({ minutes: 5 })
})

ConcourseTs.ResourceType.customise((resource_type) => {
  resource_type.set_check_every({ minutes: 5 })
})

ConcourseTs.Task.customise((task) => {
  task.platform = 'linux'
  task.set_cpu_limit_shares(2)
  task.set_memory_limit({ gb: 2 })
})

ConcourseTs.GetStep.customise((get_step) => {
  get_step.attempts = 2
  get_step.trigger = true
  get_step.set_timeout({ hours: 1 })
})

ConcourseTs.PutStep.customise((put_step) => {
  put_step.attempts = 3
  put_step.set_timeout({ hours: 6 })
})

ConcourseTs.SetPipelineStep.customise((set_pipeline_step) => {
  set_pipeline_step.attempts = 2
  set_pipeline_step.set_timeout({ minutes: 1 })
})

ConcourseTs.TaskStep.customise((task_step) => {
  task_step.attempts = 3
  task_step.set_timeout({ hours: 6 })
})

ConcourseTs.LoadVarStep.customise((load_var_step) => {
  load_var_step.attempts = 2
  load_var_step.set_timeout({ minutes: 1 })
})

ConcourseTs.InParallelStep.customise((in_parallel_step) => {
  in_parallel_step.fail_fast = true
  in_parallel_step.limit = 3
})

export const output_path = 'packages/ci/dist'
export const package_path = 'packages/ci'
