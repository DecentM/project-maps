import vikeVue from "vike-vue/config";
import type { Config } from "vike/types";
import Head from "../layouts/head-default.vue";
import Layout from "../layouts/layout-default.vue";

// Default config (can be overridden by pages)
export default {
  Layout,
  Head,

  // <title>
  title: "My Vike App",
  extends: vikeVue,
} satisfies Config;
