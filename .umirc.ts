import { defineConfig } from 'umi';
import path from 'path';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  hash: true,
  history: { type: 'hash' },
  alias: {
    '@/': path.resolve(__dirname, 'src'),
  },
  title: 'JDSignDocker',
  headScripts: [
    {
      src: 'https://as.alipayobjects.com/g/component/fastclick/1.0.6/fastclick.js',
      defer: true,
    },
    `
if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function() {
    FastClick.attach(document.body);
  }, false);
}
`,
    ' if(!window.Promise) {\n' +
    '      document.writeln(\'<script src="https://as.alipayobjects.com/g/component/es6-promise/3.2.2/es6-promise.min.js"\'+\'>\'+\'<\'+\'/\'+\'script>\');\n' +
    '    }',
  ],
  metas: [
    {
      name: 'apple-mobile-web-app-title',
      content: 'WidgetStore',
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'default',
    },
    {
      name: 'viewport',
      content:
        'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
    },
  ],
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/login', component: '@/pages/login' },
  ],
  fastRefresh: {},
  tailwindcss: {
    tailwindCssFilePath: '@/tailwind.css',
    tailwindConfigFilePath: 'tailwind-custom.config.js', // 默认取值 tailwindConfigFilePath || join(process.env.APP_ROOT || api.cwd, 'tailwind.config.js'),,
  },
});
