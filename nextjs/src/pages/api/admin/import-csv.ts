import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'serverless-mysql';
import formidable from 'formidable';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from 'utils/constants';


const db = mysql({
    config: {
        host: process.env.MYSQL_HOST || 'localhost',
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD
    }
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export default withIronSessionApiRoute(handler, sessionOptions);

async function handler(req: NextApiRequest, res: NextApiResponse) {
    //auth
    if (!req.session.user) return res.status(401).json({});
    const form = new formidable.IncomingForm();
    try {
        form.parse(req, async function (err, fields, files) {
            const filepath = (files.import as formidable.File).filepath;
            const result = await db.transaction()
                .query('DELETE FROM products')
                .query(`LOAD DATA LOCAL INFILE ?
                            INTO TABLE products
                            COLUMNS TERMINATED BY ','
                            OPTIONALLY ENCLOSED BY '"'
                            ESCAPED BY '"'
                            LINES TERMINATED BY '\n'
                            IGNORE 1 LINES;`
                    , [filepath])
                .commit();
            return res.status(200).json({ message: result });
        });
    } catch (err) {
        return res.status(400).json({ message: (err as Error).message });
    }
}