import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid';
import { renderToString } from 'react-dom/server';
import nodemailer from 'nodemailer';

import { AddUserInternal } from '../../components/email/add_user_i';

import dbQuery from '../../utils/db_fetch'
import rateLimit from '../../utils/rate_limit';
import { product } from '../../utils/types';
import { emailTrasportOptions } from '../../utils/constants';


const limiter = rateLimit({
    interval: 5 * 60 * 1000, // 5 mins
    uniqueTokenPerInterval: 500, // Max 500 users per second
})

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1kb',
        },
    },
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    //TODO: security

    //Only allow POST requests
    if (req.method !== 'POST') return res.status(404).json({});

    //ratelimiter
    if (process.env.NODE_ENV !== 'development') {
        try {
            await limiter.check(res, 2, 'CACHE_TOKEN'); // 1 request per 5 minutes
        } catch {
            return res.status(429).json({ error: 'Rate limit exceeded' });
        }
    }

    let { cart = '{}' } = req.cookies;
    let cartCount: { [x: string]: number } = {};
    let body = req.body;
    let cartItems: product[] = [];

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
        let info = await transport.sendMail({
            from: '"THIS IS A TEST" <sales@demac-egypt.com>',
            to: "krolamrolla@gmail.com",
            subject: "THIS IS A TEST",
            html: `<div>${html}</div>`,
        });
    }


    return res.status(200).json({ id: uuidv4() });
}
