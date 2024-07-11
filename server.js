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

await server.register(cors, {
  origin: '*',
  methods: ['GET'],
});

// const database = new DatabaseMemory()
const database = new DatabasePostgres()

server.addHook('preHandler', async (request, reply) => {
  const allowedOrigins = ['https://thspanhol.github.io'];
  const origin = request.headers.origin;

  if (request.method !== 'GET' && !allowedOrigins.includes(origin)) {
    reply.code(403).send({ error: 'Origin not allowed' });
  }
});

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
}, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});