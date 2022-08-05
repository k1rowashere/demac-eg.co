import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid';
import { renderToString } from 'react-dom/server';
import requestIp from 'request-ip';
import nodemailer from 'nodemailer';

import { AddUserInternal } from '../../components/email/add_user_i';

import dbQuery from '../../utils/db_fetch'
import rateLimit from '../../utils/rate_limit';
import { contactInfo, product } from '../../utils/types';
import { emailTrasportOptions } from '../../utils/constants';

export const config = { api: { bodyParser: { sizeLimit: '5kb' } } }
const limiterIp = rateLimit({ interval: 5 * 60 * 1000, uniqueTokenPerInterval: 500 })
const limiterCart = rateLimit({ interval: 10 * 60 * 1000, uniqueTokenPerInterval: 500 })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    //TODO: security

    //Only allow POST requests
    if (req.method !== 'POST') return res.status(404).send('');
    if (req.headers['content-type'] !== 'application/json') return res.status(415).json({ error: 'content-type must be application/json' });

    //ratelimiter
    if (process.env.NODE_ENV !== 'development') {
        try {
            await limiterIp.check(res, 10, requestIp.getClientIp(req) || ''); // 10 request per 5 minutes for a given ip
            await limiterCart.check(res, 1, (req.cookies.cart + JSON.stringify(req.body)) || ''); // 1 request for the same cart and same contact info
        } catch {
            return res.status(429).json({ error: 'Rate limit exceeded' });
        }
    }

    let { cart = '{}' } = req.cookies;
    let cartCount: { [x: string]: number } = {};
    let body = req.body as contactInfo;
    let cartItems: product[] = [];

    //captcha stuff
    const captchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${body.captchaToken}`);
    const captchaResponseBody = await captchaResponse.json();
    if (!captchaResponseBody.success) return res.status(409).json({ error: 'Captcha failed' });


    //parse cart and sql query for items
    try {
        cartCount = JSON.parse(cart);
        const keys = Object.keys(cartCount);

        if (keys.length) {
            cartItems = await dbQuery(`
                SELECT part_no, name, price FROM products
                    WHERE part_no IN (${keys.map(() => { return '?' })})
                    AND price <> 0;
            `, keys) as product[];
        }
    } catch {
        return res.status(400).json({});
    }

    //render internal email
    //TODO: add customer confirm email
    //TODO: add db store

    //send email
    let transport = nodemailer.createTransport(emailTrasportOptions);

    const html = renderToString(AddUserInternal({ cartCount, cartItems, contactInfo: body }));
    if (process.env.NODE_ENV === 'development') {
        console.log(html)
    } else {
        transport.sendMail({
            from: '"THIS IS A TEST" <sales@demac-egypt.com>',
            to: "krolamrolla@gmail.com",
            subject: "THIS IS A TEST",
            html: `<div>${html}</div>`,
        });
    }


    return res.status(200).json({ id: uuidv4() });
}
