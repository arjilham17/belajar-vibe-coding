import { Elysia } from 'elysia';
import { usersRoute } from './src/routes/users-route';

const app = new Elysia()
    .use(usersRoute)
    .get('/', () => 'Hello Elysia')
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);