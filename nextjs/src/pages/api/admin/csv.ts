import type { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from 'utils/constants';
import formidable from 'formidable';
import { prisma } from 'utils/prisma';
import csvtojson from 'csvtojson';

export default withIronSessionApiRoute(handler, sessionOptions);

// this is important
export const config = { api: { bodyParser: false } };

async function handler(req: NextApiRequest, res: NextApiResponse) {
    //auth check
    if (!req.session.user) return res.status(401).json({});

    if (req.method === 'GET') {
        // select everything from products table
        const result = await prisma.products.findMany();

        //convert query to csv string
        let str = 'path, part_no, name, description, price, manufacturer_link, img_link\n';
        result.forEach((el) => {
            const columnes = Object.values(el).map((col) => {
                //escapes "
                col = col.toString().replace(/"/g, '""');
                //escapes `,`
                return col.includes(',') ? `"${col}"` : col;
            });
            str += columnes.join(',') + '\n';
        });

        //send csv file
        res.setHeader('Content-Disposition', 'attachment; filename=db_dump.csv');
        return res.status(200).send(str);
    } else if (req.method === 'POST') {
        const form = new formidable.IncomingForm();
        form.parse(req, async function (err, fields, files) {
            try {
                const filepath = (files.import as formidable.File).filepath;
                // delete all rows from products table
                // then get data from csv file and insert into products table
                await prisma.$transaction([
                    prisma.products.deleteMany(),
                    prisma.products.createMany({ data: await csvtojson().fromFile(filepath) }),
                ]);
            } catch (err) {
                // check if error is caused by duplicate part_no
                if (err instanceof Error && err.message.includes('P2002'))
                    return res.status(400).json({ message: 'Duplicate part_no' });
                return res.status(500).json({ message: err });
            } finally {
            }
            return res.status(200).json({ message: 'success' });
        });
    } else {
        return res.status(404).json({});
    }
}
