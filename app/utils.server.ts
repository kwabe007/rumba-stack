import qs from "qs";
import { z } from "zod";
import { typedjson } from "remix-typedjson";
import crypto from "crypto";
import { Params } from "@remix-run/react";

export function requireEnvVar(varName: string): string {
  if (!process.env[varName]) {
    throw new Error(`${varName} must be set`);
  }
  return process.env[varName]!;
}

export async function parseRequestData(request: Request) {
  const text = await request.text();
  return qs.parse(text);
}

export function requireParam(params: Params, key: string): string {
  const result = z.string().safeParse(params[key]);
  if (!result.success) {
    throw typedjson({ message: `Missing parameter ${key}` }, { status: 400 });
  }
  return result.data;
}

export async function parseIntent<const T extends readonly [string, ...string[]]>(request: Request, intents: T): Promise<[T[number], Record<string, unknown>]> {
  const qsData = qs.parse(await request.text());
  const intentSchema = z.object({ intent: z.enum(intents) }).passthrough();
  const { intent, ...data } = intentSchema.parse(qsData);
  return [intent as T[number], data];
}

export function generateId(): string {
  return crypto.randomBytes(12).toString("hex");
}