import { IconSet } from 'quasar'
import { boot } from 'quasar/wrappers'

export default boot(() => {
  IconSet.iconMapFn = (name) => {
    if (name.startsWith('si-')) {
      return {
        cls: `si ${name}`,
      }
    }

    return {
      icon: name,
    }
  }
})
