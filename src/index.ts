import { spawn } from 'child_process';
import { loadConfig } from './config';
import { SecretsManager } from './secrets';

async function main() {
  try {
    // Load config file
    const config = loadConfig();
    const secretsManager = new SecretsManager(config.region);
    

    // Process each secret
    for (const secretConfig of config.secrets) {
      const secretValues = await secretsManager.getSecretValue(secretConfig.secretId);
      // Filter and set environment variables
      const filteredValues = secretsManager.filterSecretValues(secretValues, secretConfig);
      Object.entries(filteredValues).forEach(([key, value]) => {
        process.env[key] = value;
      });
    }

    const remainingArgs = process.argv.slice(2);
    if (remainingArgs.length > 0) {
      const child = spawn(remainingArgs[0], remainingArgs.slice(1), {
        stdio: 'inherit',
        shell: true,
        env: process.env
      });

      child.on('exit', (code: number) => {
        process.exit(code);
      });
    } else {
      console.info('No additional command provided. Exiting.');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('An unknown error occurred');
    }
    process.exit(1);
  }
}

main();