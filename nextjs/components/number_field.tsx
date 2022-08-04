import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const MAX_COUNT = 10;

export default function NumField({ value = 1, onChange = (x:string, y:number) => {}, id = ''}) {
    const [num, setNum] = useState(value);

    const incNum = () => {
        if (num < MAX_COUNT) {
            setNum(Number(num) + 1);
            onChange(id, Number(num) + 1);
        }
    };

    const decNum = () => {
        if (num > 1) {
            setNum(Number(num) - 1);
            onChange(id, Number(num) - 1);
        }
    };

    const blurHandle = (e: React.FocusEvent<HTMLInputElement> ) => {
        onChange(id, Number(e.target.value) || 1);
        if (!e.target.value) setNum(1)
    };

    return (
        <>
            <Button className='no-print pe-0' size='sm' variant='link' disabled={num === 1} onClick={decNum}>
                <i className="bi bi-dash h4" />
            </Button>
            <Form.Control style={{ width: '3em' }} type="number" size="sm" value={num} min={1} max={10} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNum(+e.currentTarget.value)} onBlur={blurHandle} />
            <Button className='no-print ps-0' size='sm' variant='link' disabled={num === MAX_COUNT} onClick={incNum}>
                <i className="bi bi-plus h4" />
            </Button>
        </>
    );
}