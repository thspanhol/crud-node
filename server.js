// import { createServer } from 'node:http'

// const server = createServer((request, response) => {
//     response.write('Hello World');
//     return response.end()
// })

// server.listen(3333)

import { fastify } from "fastify";
import cors from '@fastify/cors'
// import { DatabaseMemory } from "./database-memory.js";
import { DatabasePostgres } from "./database-postgres.js";

const server = fastify();

const restrictedCorsOptions = {
    origin: 'https://thspanhol.github.io',
    methods: ['POST', 'PUT', 'DELETE'],
};

const openCorsOptions = {
    origin: '*',
    methods: ['GET'],
};

await server.register(cors, openCorsOptions);

await server.register(cors, restrictedCorsOptions);

// const database = new DatabaseMemory()
const database = new DatabasePostgres()

server.post('/usuarios', async (request, reply) => {
    const { nome, email, senha } = request.body

    await database.create({
        nome,
        email,
        senha,
    })

    return reply.status(201).send()
})

server.get('/usuarios', async (request) => {
    const search = request.query.search

    const usuarios = await database.list(search)

    return usuarios
})

server.put('/usuarios/:id', async (request, reply) => {
    const usuarioId = request.params.id
    const { nome, email, senha } = request.body

    await database.update(usuarioId, {
        nome,
        email,
        senha
    })

    return reply.status(204).send()
})

server.delete('/usuarios/:id', async (request, reply) => {
    const usuarioId = request.params.id

    await database.delete(usuarioId)

    return reply.status(204).send()
})

server.listen({
    host: '0.0.0.0',
    port: process.env.PORT ?? 3333,
})