import { sql } from './db.js'

sql`
CREATE TABLE usuarios (
    id    TEXT PRIMARY KEY,
    nome  TEXT,
    email TEXT,
    senha TEXT
);
`.then(() => {
    console.log('Tabela criada!');
})