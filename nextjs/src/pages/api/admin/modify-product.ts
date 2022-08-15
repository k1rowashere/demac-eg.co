import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { sessionOptions } from 'utils/constants';
import dbQuery from 'utils/db_fetch';


export default withIronSessionApiRoute(productEdit, sessionOptions);


export type dbEditReq = {
    action: 'edit',
    part_no: string,
    fields: {
        path?: string,
        name?: string,
        description?: string,
        price?: number,
        img_link?: string,
        manufacturer_link?: string,
    }
};

type dbAddReq = {
    action: 'add'
    part_no: string,
    path: string,
    name: string,
    description: string,
    price: number,
    img_link: string,
    manufacturer_link: string,
};

async function productEdit(req: NextApiRequest, res: NextApiResponse) {
    //auth
    if (!req.session.user) return res.status(401).json({});

    const body = req.body as dbAddReq | dbEditReq;
    let message = null;

    try {
        switch (body.action) {
            case 'edit':
                {
                    const allowedFields = ['path', 'name', 'description', 'price', 'img_link', 'manufacturer_link'];
                    const keys: string[] = [], values: (string | number)[] = [];

                    for (const [key, value] of Object.entries(body.fields)) {
                        if (!allowedFields.includes(key)) continue;
                        keys.push(key);
                        values.push(value);
                    }

                    let setFields = keys.map(key => `${key} = ?`).join(', ')

                    message = await dbQuery('UPDATE products SET ' + setFields + ' WHERE part_no = ?;', [...values, body.part_no])
                    break;
                }

            case 'add':
                {
                    const { path, part_no, name, description, price, manufacturer_link, img_link } = req.body;
                    message = await dbQuery(`INSERT INTO products (path, part_no, name, description, price, manufacturer_link, img_link)
                                        VALUES (?,?,?,?,?,?,?);`,
                        [path, part_no, name, description, price, manufacturer_link, img_link])
                    break;
                }
        }
    } catch (err) {
        return res.status(500).json({ message: (err as Error).message })
    }

    return res.status(200).json(message);

}