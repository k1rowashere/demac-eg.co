import { products } from '@prisma/client';
import React from 'react';
import { currencyFormater } from 'utils/constants';
import { contactInfo } from 'utils/types';

type AllOrNone<T> = T | { [K in keyof T]?: never };
type Props = AllOrNone<{
    cartCount: { [key: string]: number };
    cartItems: Pick<products, 'part_no' | 'name' | 'price'>[];
}> & { contactInfo: contactInfo };

export default function ContactUsInternal({ cartCount, cartItems, contactInfo }: Props) {
    return (
        <>
            {/* Contact Info */}
            {Object.entries(contactInfo).map(([key, value]) => (
                <p key={key}>{`${key}: ${value}`}</p>
            ))}
            <br />
            <br />
            {/* Cart */}
            {cartItems && (
                <table
                    style={{
                        width: '100%',
                        marginRight: '20px',
                        marginLeft: '20px',
                        tableLayout: 'fixed',
                    }}
                >
                    <tr>
                        <th
                            style={{
                                textAlign: 'left',
                            }}
                        >
                            Name
                        </th>
                        <th>Part Number</th>
                        <th>Unit Price</th>
                        <th>Quantity</th>
                    </tr>
                    {cartItems.map((el, index) => (
                        <tr key={index}>
                            <th
                                style={{
                                    maxWidth: '100px',
                                    textAlign: 'left',
                                }}
                            >
                                {el.name}
                            </th>
                            <th>{el.part_no}</th>
                            <th>{currencyFormater(el.price)}</th>
                            <th>{cartCount[el.part_no]}</th>
                        </tr>
                    ))}
                </table>
            )}
        </>
    );
}
