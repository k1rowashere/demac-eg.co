import { useState, useRef, useCallback } from 'react';
import { Button, Form } from 'react-bootstrap';

const MAX_COUNT = 10;
const MIN_COUNT = 1;

export default function NumField({ id, initValue, onChange }: { initValue: number | undefined, onChange: (id: string, count: number) => void, id: string }) {
    const [value, setValue] = useState(initValue ?? 1)

    const incNum = () => {
        const newVal = Math.min(value + 1, MAX_COUNT);
        setValue(newVal);
        onChange(id, newVal);
    };

    const decNum = () => { 
        const newVal = Math.max(value - 1, MIN_COUNT);
        setValue(newVal);
        onChange(id, newVal);
    };
    const changeHandle = (e: React.ChangeEvent<HTMLInputElement>) => setValue(Math.max(Math.min(Number(e.target.value), MAX_COUNT), MIN_COUNT));
    const blurHandle = (e: React.FocusEvent<HTMLInputElement>) => onChange(id, value);

    return <>
        <Button className='no-print pe-0' size='sm' variant='link' disabled={value === MIN_COUNT} onClick={decNum}>
            <i className="bi bi-dash h4" />
        </Button>
        <Form.Control style={{ width: '3em' }} type="number" size="sm" value={value} min={MIN_COUNT} max={MAX_COUNT} onChange={changeHandle} onBlur={blurHandle} />
        <Button className='no-print ps-0' size='sm' variant='link' disabled={value === MAX_COUNT} onClick={incNum}>
            <i className="bi bi-plus h4" />
        </Button>
    </>;
}