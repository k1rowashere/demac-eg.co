import React from "react";
import { currencyFormater } from "../../utils/constants";
import { contactInfo, product } from "../../utils/types";

export function AddUserInternal({ cartCount, cartItems, contactInfo }: { cartCount: { [x: string]: number }, cartItems: product[], contactInfo: contactInfo }) {
    return <>
        {(() => {
            let list: JSX.Element[] = [];
            for (const [key, value] of Object.entries(contactInfo)) {
                list.push(<p key={key}>{`${key}: ${value}`}</p>)
            }
            return list;
        })()}
        <br />
        <br />
        <table style={{
            width: '100%',
            marginRight: '20px',
            marginLeft: '20px',
            tableLayout: 'fixed'
        }}>
            <tr>
                <th style={{
                    textAlign: 'left'
                }}>Name</th>
                <th>Part Number</th>
                <th>Unit Price</th>
                <th>Quantity</th>
            </tr>
            {cartItems.map((el, index) => <tr key={index}>
                <th style={{
                    maxWidth: '100px',
                    textAlign: 'left'
                }}>{el.name}</th>
                <th>{el.part_no}</th>
                <th>{currencyFormater(el.price)}</th>
                <th>{cartCount[el.part_no]}</th>
            </tr>)}
        </table>
    </>;
}
