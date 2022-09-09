import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { renderToString } from 'react-dom/server';
import nodemailer from 'nodemailer';

import ContactUsInteral from 'email/ContactUsInternal';

import { contactInfo } from 'utils/types';
import { emailTrasportOptions } from 'utils/constants';
import { prisma } from 'utils/prisma';
import captchaCheck from 'utils/captcha';

export const config = { api: { bodyParser: { sizeLimit: '5kb' } } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let body = req.body as contactInfo;

    if (req.method !== 'POST') return res.status(404).json({});
    if (req.headers['content-type'] !== 'application/json')
        return res.status(415).json({ error: 'content-type must be application/json' });

    // guard no empty cart
    if (!body) return res.status(400).json({ error: 'body is empty' });

    if (!(await captchaCheck(body.captchaToken)))
        return res.status(400).json({ error: 'captcha failed' });

    // --------------------------- //
    //parse cart and sql query for items

    let cartCount: { [x: string]: number } = {};

    try {
        cartCount = JSON.parse(req.cookies.cart ?? '');
    } catch {
        // delete cookie if it is invalid
        res.setHeader('Set-Cookie', 'cart=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;');
        return res.status(400).json({});
    }

    // guard no empty cart
    if (!Object.keys(cartCount).length) return res.status(400).json({ error: 'cart is empty' });

    // sql query for items
    const keys = Object.keys(cartCount);

    const cartItems = await prisma.products.findMany({
        where: {
            part_no: {
                in: keys,
            },
            price: {
                not: 0,
            },
        },
        select: {
            part_no: true,
            name: true,
            price: true,
        },
    });

    //TODO: add customer confirm email
    //TODO: add db store

    //send email to admin
    const html = renderToString(
        ContactUsInteral({ cartCount, cartItems: cartItems ?? [], contactInfo: body })
    );
    if (process.env.NODE_ENV === 'development') {
        console.log(html);
    } else {
        let transport = nodemailer.createTransport(emailTrasportOptions);
        transport.sendMail({
            from: '"THIS IS A TEST" <sales@demac-egypt.com>',
            to: 'krolamrolla@gmail.com',
            subject: 'THIS IS A TEST',
            html: `<div>${html}</div>`,
        });
    }

    return res.status(200).json({ id: uuidv4() });
}
