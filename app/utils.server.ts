export function requireEnvVar(varName: string): string {
  if (!process.env[varName]) {
    throw new Error(`${varName} must be set`);
  }
  return process.env[varName]!;
}