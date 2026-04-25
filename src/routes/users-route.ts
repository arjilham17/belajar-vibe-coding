import { Elysia, t } from "elysia";
import { UserService } from "../services/user-service";

const userService = new UserService();

export const usersRoute = new Elysia({ prefix: "/api" })
    .post("/users", async ({ body, set }) => {
        try {
            return await userService.register(body.name, body.email, body.password);
        } catch (error: any) {
            set.status = 400;
            return { error: error.message };
        }
    }, {
        body: t.Object({
            name: t.String(),
            email: t.String(),
            password: t.String()
        })
    })
    .post("/login", async ({ body, set }) => {
        try {
            return await userService.login(body.email, body.password);
        } catch (error: any) {
            set.status = 401;
            return { error: error.message };
        }
    }, {
        body: t.Object({
            email: t.String(),
            password: t.String()
        })
    })
    .post("/users/current", async ({ headers, set }) => {
        try {
            const authHeader = headers['authorization'];
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw new Error("unautorized");
            }

            const token = authHeader.split(' ')[1];
            return await userService.getCurrentUser(token);
        } catch (error: any) {
            set.status = 401;
            return { error: error.message };
        }
    });
