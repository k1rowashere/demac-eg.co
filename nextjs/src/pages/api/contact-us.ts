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

    //Only allow POST requests and application/json content type
    if (req.method !== 'POST') return res.status(404).json({});
    if (req.headers['content-type'] !== 'application/json')
        return res.status(415).json({ error: 'content-type must be application/json' });

    // captcha check
    if (!(await captchaCheck(body.captchaToken)))
        return res.status(400).json({ error: 'captcha failed' });

    // --------------------------- //

    //TODO: add customer confirm email
    //TODO: add db store

    // store contact info in db
    // const prisma = new PrismaClient();
    // const contact = await prisma.contact.create({
    //     data: {
    //         id: uuidv4(),
    //         email: body.email,
    //         name: body.name,
    //         company: body.company,
    //         phone: body.phone,
    //         message: body.message,
    //     },
    // });

    //send email to admin
    const html = renderToString(ContactUsInteral({ contactInfo: body }));
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
