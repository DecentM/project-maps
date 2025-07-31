import { rc } from '@decentm/concourse-ts-cli'

export default rc({
  compile: {
    input: 'src/pipelines/*.ts',
    clean: true,
    output: 'dist',
  }
})
