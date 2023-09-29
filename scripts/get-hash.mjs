import bcrypt from "bcryptjs";
import promptSync from "prompt-sync";

const promptFunc = promptSync();

const userInput = promptFunc({ echo: "*" });

const hashed = bcrypt.hashSync(userInput, 10);
console.log(hashed)