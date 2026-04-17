import { defineConfig } from 'cypress';

type Environment = 'local' | 'dev' | 'qa' | 'prod';

const environment = (process.env['CYPRESS_ENV'] as Environment) || 'local';

const configEnv = {
  local: {
    baseUrl: 'http://localhost:4200',
  },
  dev: {
    baseUrl: 'https://opendata-dev.ncats.nih.gov',
  },
  demo: {
    baseUrl: 'https://opendata-demo.ncats.nih.gov',
  },
  qa: {
    baseUrl: 'https://opendata-qa.ncats.nih.gov',
  },
  prod: {
    baseUrl: 'https://opendata.ncats.nih.gov',
  },
};

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      config.baseUrl = process.env['CYPRESS_baseUrl'] || configEnv[environment].baseUrl;
      return config;
    },
    experimentalStudio: true,
  },
});
