import type { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from 'utils/constants';
import dbQuery from 'utils/db_fetch';
import { product } from 'utils/types';

export default withIronSessionApiRoute(handler, sessionOptions);

async function handler(req: NextApiRequest, res: NextApiResponse) {
    //auth
    if (!req.session.user) return res.status(401).json({});
    const result = await dbQuery('SELECT * from products') as product[];

    //convert query to csv string
    let str = 'path, part_no, name, description, price, manufacturer_link, img_link\n';
    result.forEach(el => {
        const values = Object.values(el).map(value => {
            //escapes `"`
            value = value.toString().replace(/"/g, '""');
            //escapes `,`
            return (value.includes(',') ? `"${value}"` : value);
        });
        str += values.join(',') + '\n';
    });

    res.setHeader('Content-Disposition', 'attachment; filename=db_dump.csv');
    return res.status(200).send(str);
}