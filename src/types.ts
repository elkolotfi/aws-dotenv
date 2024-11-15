export interface SecretConfig {
  secretId: string;
  vars: string[];
}

export interface AWSEnvConfig {
  region: string;
  secrets: SecretConfig[];
}
