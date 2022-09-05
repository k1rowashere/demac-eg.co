import { withIronSessionSsr } from 'iron-session/next';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import LogoutButton from 'components/admin/LogoutButton';

import type { GetServerSidePropsContext } from 'next';
import type InferGetServerSidePropsType from 'infer-next-props-type';

import { sessionOptions } from 'utils/constants';
import { prisma } from 'utils/prisma';

async function handler(ctx: GetServerSidePropsContext) {
    const user = ctx.req.session.user;
    // if user is not logged in, redirect to login page
    if (!user?.isLoggedIn) return { redirect: { destination: '/admin/login', permanent: false } };

    // else, get all products
    const _products = await prisma.products.findMany();
    prisma.$disconnect();

    // convert decimal to number in products to fix serialization error
    const products = _products.map((product) => ({ ...product, price: Number(product.price) }));

    return { props: { products } };
}

export const getServerSideProps = withIronSessionSsr(handler, sessionOptions);

ProductEdit.disableLayout = true;

// create a new product
const empty = () => ({
    path: '',
    part_no: '',
    name: '',
    description: '',
    price: 0,
    img_link: '',
    manufacturer_link: '',
});

export default function ProductEdit({ products }: InferGetServerSidePropsType<typeof handler>) {
    const router = useRouter();
    const [selectedProduct, setSelectedProduct] = useState(empty());
    const [isEditing, setIsEditing] = useState(false);
    // list of enabled fields for product
    const [enabledFields, setEnabledFields] = useState(new Array(7).fill(false));
    // server side validation errors
    const [response, setResponse] = useState<string>('');
    const [confirm, setConfirm] = useState<string>('');
    const fileRef = useRef<HTMLInputElement>(null);

    // handlers
    const handleFileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // type guards
        if (fileRef.current === null) return;
        if (fileRef.current.files === null) return;

        const payload = new FormData();
        payload.append('import', fileRef.current.files[0]);

        const res = await fetch('/api/admin/csv', {
            method: 'POST',
            body: payload,
        });
        setResponse((await res.json()).message);
        setConfirm('');
        router.replace(router.asPath, undefined, { scroll: false });
    };

    const handleSubmit = async (
        e: React.MouseEvent<HTMLButtonElement>,
        method: 'PATCH' | 'PUT' | 'DELETE'
    ) => {
        e.preventDefault();

        // type guards
        if (selectedProduct.part_no === undefined) return;

        // filter out disabled fields unless method is PUT
        let _payload =
            method === 'PUT'
                ? selectedProduct
                : Object.fromEntries(
                      Object.entries(selectedProduct).filter((_, i) => enabledFields[i])
                  );

        _payload.part_no = selectedProduct.part_no;

        // set payload to each key value from selected product
        const payload = new FormData();
        Object.entries(_payload).forEach(([key, value]) => {
            payload.append(key, value.toString());
        });

        const res = await fetch('/api/admin/product', {
            method,
            body: payload,
        });
        setResponse((await res.json()).message);
        router.replace(router.asPath, undefined, { scroll: false });
        // reset selected product
        setSelectedProduct(empty());
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

    // ------------------------------

    return (
        <Container className='py-2'>
            <LogoutButton className='float-end' />
            {
                //back button
            }
            <Button onClick={() => router.push('/admin')}>
                <i className='bi bi-house'></i>
            </Button>

            <Container className='my-5'>
                <h1>Edit Products</h1>
                <Form>
                    <InputGroup>
                        <InputGroup.Text>part_no</InputGroup.Text>
                        {isEditing ? (
                            <Form.Control
                                id='part_no'
                                value={selectedProduct.part_no.toString()}
                                onChange={handleFieldChange}
                            />
                        ) : (
                            <Form.Select defaultValue='part no' onChange={handleDropdownSelect}>
                                <option disabled>part no</option>
                                {products.map((product) => (
                                    <option key={product.part_no}>{product.part_no}</option>
                                ))}
                            </Form.Select>
                        )}
                        <InputGroup.Text>Create New Product:</InputGroup.Text>
                        <InputGroup.Checkbox
                            checked={isEditing}
                            onChange={() => setIsEditing((curr) => !curr)}
                        />
                    </InputGroup>
                    {Object.entries(selectedProduct).map(([key, value], index) =>
                        // if key is part_no, skip
                        key === 'part_no' ? null : (
                            <InputGroup className='mt-1' key={key}>
                                <InputGroup.Text style={{ width: '8em' }}>{key}</InputGroup.Text>
                                <InputGroup.Checkbox
                                    id={index}
                                    disabled={isEditing}
                                    checked={enabledFields[index]}
                                    onChange={handleCheckChange}
                                />
                                <Form.Control
                                    id={key}
                                    disabled={!(enabledFields[index] || isEditing)}
                                    value={value.toString()}
                                    onChange={handleFieldChange}
                                />
                            </InputGroup>
                        )
                    )}
                    <Stack className='mt-2' direction='horizontal' gap={2}>
                        <Button
                            variant='primary'
                            onClick={(e) => handleSubmit(e, 'PATCH')}
                            disabled={isEditing}
                        >
                            Update Product
                        </Button>
                        <Button
                            variant='success'
                            onClick={(e) => handleSubmit(e, 'PUT')}
                            disabled={!isEditing}
                        >
                            Create Product
                        </Button>
                        <Button
                            className='ms-auto'
                            variant='danger'
                            onClick={(e) => handleSubmit(e, 'DELETE')}
                            disabled={isEditing}
                        >
                            Delete Product
                        </Button>
                    </Stack>
                </Form>
                <br />
                <Form onSubmit={handleFileSubmit}>
                    <Form.Label>Import/Export CSV:</Form.Label>
                    <Form.Control ref={fileRef} type='file' accept='.csv' required />
                    <Stack className='mt-2' direction='horizontal' gap={2}>
                        <a href='/api/admin/csv' target='_blank'>
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
                <Form.Control
                    as='textarea'
                    readOnly
                    value={response}
                    style={{ height: '100px' }}
                ></Form.Control>
            </Container>
        </Container>
    );
}
