import { boot } from 'quasar/wrappers'
import VueMaplibreGl from 'vue-maplibre-gl'

export default boot(({ app }) => {
  app.use(VueMaplibreGl)
})
