import Vue from 'vue';
import fs from 'fs';
import path from 'path';

// ===
// Register global components
// Used https://github.com/chrisvfritz/vue-enterprise-boilerplate/ for reference
// ===

const globalComponentFiles = fs
  .readdirSync(path.join(__dirname, '../src/components/base_components'));

globalComponentFiles.forEach((fileName) => {
  const componentName   = fileName.replace(/^\.\//, '').replace(/\.\w+$/, '');
  const componentConfig = require(`../src/components/base_components/${fileName}`);

  Vue.component(componentName, componentConfig.default || componentConfig);
});
