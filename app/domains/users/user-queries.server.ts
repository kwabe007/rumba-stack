import bcrypt from "bcryptjs";
import { User, UserCreate, UserSchema, UserWithPasswordSchema } from "~/domains/users/user-schema";
import { db } from "~/database/node-mongo.server";

export const userService = db.createService<User>("users", {
  schemaValidator: (data) => UserSchema.parseAsync(data),
});

export const passwordService = db.createService("passwords", {
  schemaValidator: (data) => UserWithPasswordSchema.parseAsync(data),
});

export async function createUser({ password, ...userCreateWithoutPassword }: UserCreate) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userService.insertOne(userCreateWithoutPassword, {});
  await passwordService.insertOne({
    userId: user._id,
    hash: hashedPassword
  });

  return user;
}

export async function getUserById(_id: string) {
  return  await userService.findOne({ _id });
}

export async function getUserByEmail(email: string) {
  return  await userService.findOne({ email });
}

export async function verifyLogin(
  email: string,
  password: string
) {
  const docs = await userService.aggregate([
    {
      $match: {
        email
      }
    },
    {
      $lookup: {
        from: "passwords",
        localField: "_id",
        foreignField: "userId",
        pipeline: [{
          $limit: 1
        }],
        as: "password"
      }
    },
    {
      $unwind: {
        path: "$password"
      }
    }
  ]);
  const doc = docs[0] ?? null;

  const userWithPassword = UserWithPasswordSchema.nullable().parse(doc);

  if (!userWithPassword) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}