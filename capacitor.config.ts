import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cl.vicenteabse.trivy',
  appName: 'Trivy',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
