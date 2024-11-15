import { readFileSync } from 'fs';
import { z } from 'zod';
import { AWSEnvConfig } from './types';

const SecretConfigSchema = z.object({
  secretId: z.string(),
  vars: z.array(z.string()),
});

const ConfigSchema = z.object({
  region: z.string(),
  secrets: z.array(SecretConfigSchema),
});

export function loadConfig(path: string = '.aws-env.json'): AWSEnvConfig {
  try {
    const configFile = readFileSync(path, 'utf-8');
    const config = JSON.parse(configFile);
    return ConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load config: ${error.message}`);
    }
    throw error;
  }
}