import LogoutButton from 'components/admin/LogoutButton';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { dbEditReq } from 'pages/api/admin/modify-product';
import React, { useRef, useState } from 'react';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import { sessionOptions } from 'utils/constants';
import dbQuery from 'utils/db_fetch';
import { product } from 'utils/types';

async function handler(ctx: GetServerSidePropsContext) {
    const user = ctx.req.session.user;
    if (!user?.isLoggedIn) {
        return {
            redirect: { destination: '/admin/login', permanent: false },
            props: {
                products: [],
            },
        };
    } else {
        const query = (await dbQuery(`
            SELECT * FROM products;
        `)) as product[];

        return {
            props: {
                products: query.map((el) => ({ ...el })),
            },
        };
    }
}

export const getServerSideProps = withIronSessionSsr(handler, sessionOptions);

export default function ProductEdit({ products }: InferGetServerSidePropsType<typeof handler>) {
    const router = useRouter();
    const fieldNames: (keyof product & keyof dbEditReq['fields'])[] = [
        'path',
        'name',
        'description',
        'price',
        'manufacturer_link',
        'img_link',
    ];
    const [selectedProduct, setSelectedProduct] = useState<product>({} as product);
    const [enabledFields, setEnabledFields] = useState(Array.from({ length: 5 }, () => false));
    const [response, setResponse] = useState<string>('');
    const [confirm, setConfirm] = useState<string>('');
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // type guards
        if (fileRef.current === null) return;
        if (fileRef.current.files === null) return;

        const payload = new FormData();
        payload.append('import', fileRef.current.files[0]);

        const res = await fetch('/api/admin/import-csv', {
            method: 'POST',
            body: payload,
        });
        setResponse(JSON.stringify(await res.json()));
        router.replace(router.asPath);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let fields: dbEditReq['fields'] = {};
        fieldNames.forEach((field, index) => {
            // @ts-ignore
            fields[field] = enabledFields[index] ? selectedProduct[field] : undefined;
        });
        const req: dbEditReq = {
            action: 'edit',
            part_no: selectedProduct.part_no,
            fields,
        };
        const res = await fetch('/api/admin/modify-product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...req }),
        });
        setResponse(JSON.stringify(await res.json()));
        router.replace(router.asPath);
    };

    const handleDropdownSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedProduct(products.filter((product) => product.part_no === e.target.value)[0]);
    };

    const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEnabledFields((curr) => {
            let copy = Array.from(curr);
            copy[+e.target.id] = Boolean(e.target.checked);
            return copy;
        });
    };

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedProduct({ ...selectedProduct, [e.target.id]: e.target.value });
    };

    return (
        <>
            <LogoutButton />
            <Container className='my-5'>
                <h1>Edit Products</h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Select defaultValue='part no' onChange={handleDropdownSelect}>
                        <option disabled>part no</option>
                        {products.map((product) => (
                            <option key={product.part_no}>{product.part_no}</option>
                        ))}
                    </Form.Select>
                    {fieldNames.map((field, index) => (
                        <InputGroup className='mt-1' key={field}>
                            <InputGroup.Text style={{ width: '8em' }}>{field}</InputGroup.Text>
                            <InputGroup.Checkbox
                                id={index}
                                checked={enabledFields[index]}
                                onChange={handleCheckChange}
                            />
                            <Form.Control
                                id={field}
                                disabled={!enabledFields[index]}
                                value={selectedProduct[field] || ''}
                                onChange={handleFieldChange}
                            />
                        </InputGroup>
                    ))}
                    <Stack className='mt-2' direction='horizontal' gap={2}>
                        <Button type='submit'>Update Product</Button>
                    </Stack>
                </Form>
                <br />
                <Form onSubmit={handleFileSubmit}>
                    <Form.Label>Import/Export CSV:</Form.Label>
                    <Form.Control ref={fileRef} type='file' accept='.csv' required />
                    <Stack className='mt-2' direction='horizontal' gap={2}>
                        <a href='/api/admin/export-csv' target='_blank'>
                            <Button>Download CSV</Button>
                        </a>
                        <Button type='submit' disabled={confirm !== 'confirm'}>
                            Upload CSV
                        </Button>
                        <Form.Control
                            className='ms-auto'
                            style={{ maxWidth: '20em' }}
                            value={confirm}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setConfirm(e.target.value)
                            }
                            placeholder='Type `confirm` to upload'
                        />
                    </Stack>
                </Form>
                <br />
                <Form.Label>Sever Output:</Form.Label>
                <Form.Control readOnly value={response}></Form.Control>
            </Container>
        </>
    );
}
