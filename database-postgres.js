import { randomUUID } from 'node:crypto'
import { sql } from './db.js'

export class DatabasePostgres {

    async list(search) {
        let usuarios

        if (search) {
            usuarios = await sql`select * from usuarios where email ilike ${'%' + search + '%'}`
        } else {
            usuarios = await sql`select * from usuarios`
        }

        return usuarios
    }
    
    async create(usuario) {
        const usuarioId = randomUUID()
        const { nome, email, senha } = usuario

        await sql`insert into usuarios (id, nome, email, senha) VALUES (${usuarioId}, ${nome}, ${email}, ${senha})`

    }

    async update(id, usuario) {
        const { nome, email, senha } = usuario

        await sql`update usuarios set nome = ${nome}, email = ${email}, senha = ${senha} WHERE id = ${id}`
    }

    async delete(id) {
        await sql`delete from usuarios where id = ${id}`
    }
}