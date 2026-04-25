import { db } from "../db";
import { users, sessions } from "../schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

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

    async login(email: string, password: string) {
        // Find user by email
        const user = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (!user) {
            throw new Error("email atau password salah");
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error("email atau password salah");
        }

        // Generate token
        const token = uuidv4();

        // Create session
        await db.insert(sessions).values({
            token,
            userId: user.id
        });

        return { data: token };
    }
}
