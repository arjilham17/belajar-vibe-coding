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
    });
