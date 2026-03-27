import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'hey-api/backend', // sign up at app.heyapi.dev
  output: 'src/data',
   plugins: ['@hey-api/client-fetch'], 
});