import { 
  SecretsManagerClient, 
  GetSecretValueCommand 
} from "@aws-sdk/client-secrets-manager";
import { SecretConfig } from "./types";

export class SecretsManager {
  private readonly client: SecretsManagerClient;
  constructor(region: string) {
    this.client = new SecretsManagerClient({ region });
  }

  async getSecretValue(secretId: string): Promise<Record<string, string>> {
    try {
      const response = await this.client.send(
        new GetSecretValueCommand({
          SecretId: secretId,
        })
      );
  
      if (!response.SecretString) {
        throw new Error(`No secret string found for secret: ${secretId}`);
      }
  
      return JSON.parse(response.SecretString);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch secret ${secretId}: ${error.message}`);
      }
      throw error;
    }
  }

  filterSecretValues(
    secretValues: Record<string, string>,
    secretConfig: SecretConfig
  ): Record<string, string> {
    return secretConfig.vars.reduce((filtered, varName) => {
      if (varName in secretValues) {
        filtered[varName] = secretValues[varName];
      } else {
        console.warn(`Warning: Variable "${varName}" not found in secret`);
      }
      return filtered;
    }, {} as Record<string, string>);
  }
}
