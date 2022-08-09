import mysql from 'serverless-mysql';

const db = mysql({
    config: {
        host: process.env.MYSQL_HOST || 'localhost',
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD
    }
});

export default async function dbQuery(query: string, ...rest: any[]) {
    const results = await db.query(query, ...rest);
    await db.end();
    return results;
}