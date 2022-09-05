import { Prisma, PrismaClient, products } from '@prisma/client';
import formidable from 'formidable';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { sessionOptions } from 'utils/constants';
import { prisma } from 'utils/prisma';

export default withIronSessionApiRoute(productEdit, sessionOptions);

// this is important
export const config = { api: { bodyParser: false } };

async function productEdit(req: NextApiRequest, res: NextApiResponse) {
    //auth
    // if (!req.session.user) return res.status(401).json({});

    //get body data using formidable
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields) => {
        if (err) return res.status(500).json({});
        // check if part_no is given
        if (!fields.part_no) return res.status(400).json({ message: 'part_no is required' });

        // convert body data to prisma products data
        const data: Prisma.productsCreateInput = {
            part_no: fields.part_no as string,
            path: fields.path as string,
            name: fields.name as string,
            description: fields.description as string,
            price: fields.price as string,
            manufacturer_link: fields.manufacturer_link as string,
            img_link: fields.img_link as string,
        };

        try {
            if (req.method === 'PUT') {
                await prisma.products.create({ data });
                return res.status(200).json({ message: 'Product created' });
            } else if (req.method === 'PATCH') {
                await prisma.products.update({
                    where: { part_no: data.part_no },
                    data,
                });
                return res.status(200).json({ message: 'Product updated' });
            } else if (req.method === 'DELETE') {
                console.log('delete');

                await prisma.products.delete({ where: { part_no: data.part_no } });
                return res.status(200).json({ message: 'Product deleted' });
            } else {
                return res.status(404).json({});
            }
        } catch (err) {
            let message;
            // type guard for prisma error
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                // check if error is unique constraint violation
                if (err.code === 'P2002') {
                    message = 'Product already exists';
                } else {
                    message = err.message;
                }
            } else {
                message = 'Internal server error';
            }
            return res.status(500).json({ message });
        } finally {
            await prisma.$disconnect();
        }
    });
}
