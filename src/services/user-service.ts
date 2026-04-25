import { db } from "../db";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export class UserService {
    async register(name: string, email: string, password: string) {
        // Check if email already exists
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (existingUser) {
            throw new Error("email sudah terdaftar");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        await db.insert(users).values({
            name,
            email,
            password: hashedPassword
        });

        return { data: "OK" };
    }
}
