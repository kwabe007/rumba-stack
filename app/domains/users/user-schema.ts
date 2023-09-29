import { z } from "zod";

export enum Role {
  Admin = "ADMIN",
  Member = "MEMBER",
}

export const UserSchema = z.object({
  _id: z.string(),
  email: z.string().email(),
  role: z.nativeEnum(Role).default(Role.Member),
});
export type User = z.infer<typeof UserSchema>;

export const PasswordSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  hash: z.string(),
});
export type Password = z.infer<typeof PasswordSchema>;

export const UserWithPasswordSchema = UserSchema.extend({
  password: PasswordSchema,
})
export type UserWithPassword = z.infer<typeof UserWithPasswordSchema>;

const UserCreateSchema = UserSchema.omit({ _id: true }).extend({ password: z.string().min(8) });
export type UserCreate = z.infer<typeof UserCreateSchema>;