import { useState } from "react";
import { UseFormReturn, useForm, SubmitHandler } from 'react-hook-form';

import { Button, Form, InputGroup, FloatingLabel, Stack, OverlayTrigger, Spinner } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2'
import SuccessModal from "./success_status_modal";

import { contactInfo } from "../utils/types";
import { doesNotMatch } from "assert";

type MyFormControl = {
    type?: string;
    register: any;
    label?: string;
    errors: any;
    required?: boolean;
    [x: string]: any;
}

function MyFormControl({ type = 'text', register, label = '', errors, required = true, ...rest }: MyFormControl) {
    return (
        <Form.Floating error-message={errors[register.name] && errors[register.name].message} {...rest}>
            <Form.Control id={register.name} type={type} isInvalid={errors[register.name]} required={required} placeholder='' {...register} />
            <label htmlFor={register.name} >{label}</label>
        </Form.Floating>
    );
}

async function sendInfo(body: contactInfo) {

    const res = await fetch(`/api/add-contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    return res.status
}

export default function ContactForm({ handleClose = () => { }, showCancel = false, form }: {handleClose?: () => void, showCancel?: boolean, form: UseFormReturn<contactInfo>}) {

    const { watch, control, register, handleSubmit, formState: { errors } } = form
    const [confirm, setConfirm] = useState(0); // 0: no clicks, 1: waiting for confirm, 2: loading
    const [successStatus, setSuccessStatus] = useState({ show: false, status: 0 } as { show: boolean, status?: number });

    // const required = { required: { value: true, message: "Required" } }
    // const nameValid = { minLength: { value: 3, message: 'Too short' }, maxLength: { value: 32, message: 'Too long' } }
    // const emailValid = { pattern: { value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g, message: 'Invalid email' } }
    // const mobileValid = { minLength: { value: 12, message: 'Invalid' }, maxLength: { value: 12, message: 'Invalid' } }
    // const phoneValid = {
    //     pattern: { value: /^[0-9]*$/, message: 'Invalid number' },
    //     minLength: { value: 9, message: 'Too short' },
    //     maxLength: { value: 10, message: 'Too long' }
    // }


    //for testing
    const required = {}
    const nameValid = {}
    const emailValid = {}
    const mobileValid = {}
    const phoneValid = {}


    const onSubmit: SubmitHandler<contactInfo> = async data => {
        setConfirm(2);
        const status = await sendInfo(data);
        setConfirm(0);
        setSuccessStatus({ show: true, status });
    };

    const handleSubmitClick = async () => {
        if (/* await trigger('',{ shouldFocus: true }) && */ confirm === 0) {
            setConfirm(1);
        } else if (confirm === 1) {
            handleSubmit(onSubmit)();
        }
    };

    return (<>
        <Form as='form'>
            <h3>Personal Info</h3>
            <hr />

            {/* Name */}
            <Stack direction='horizontal' gap={3} className='mt-3'>
                <MyFormControl className='w-50' label='First name' register={register('firstName', { ...required, ...nameValid })} errors={errors} />
                <MyFormControl className='w-50' label='Last name' register={register('lastName', { ...required, ...nameValid })} errors={errors} />
            </Stack>

            {/* Company */}
            <InputGroup className='mt-3'>
                <InputGroup.Text><i className="bi bi-building" /></InputGroup.Text>
                <MyFormControl label='Company name' register={register('companyName', { ...required, ...nameValid })} errors={errors} />
            </InputGroup>

            {/* job title */}
            <InputGroup className='mt-3'>
                <InputGroup.Text><i className="bi bi-person-lines-fill" /></InputGroup.Text>
                <MyFormControl label='Job title' register={register('jobTitle', { ...required, ...nameValid })} errors={errors} />
            </InputGroup>

            <h3 className='mt-3'>Contact Info</h3>
            <hr />

            {/* email */}
            <InputGroup className='mt-3'>
                <InputGroup.Text>@</InputGroup.Text>
                <MyFormControl type='email' label='Email' register={register('email', {
                    ...required,
                    ...emailValid
                })} errors={errors} />
            </InputGroup>

            {/* phone/mobile */}
            <InputGroup className='mt-3 stack'>
                <InputGroup.Text><i className='bi bi-phone' /></InputGroup.Text>
                {/* TODO */}
                {/* <MyFormControl type='tel' label='Mobile number' register={register('mobile', { ...required, ...mobileValid })} errors={errors} /> */}
                <Form.Floating error-message={errors.mobile && errors.mobile.message}>
                    <PhoneInput
                        inputProps={{ required: true, autoFocus: true, id: 'mobile', ...register('mobile', { ...required, ...mobileValid }) }}
                        inputClass={errors.mobile && ' is-invalid'}
                        containerClass={Boolean(watch('mobile')) ? 'has-value': ''}
                        value={watch('mobile')}
                        country='eg'
                        countryCodeEditable={false}
                        enableSearch
                        placeholder=""
                    />
                    <label htmlFor='mobile'>Mobile number</label>
                </Form.Floating>
                <InputGroup.Text><i className='bi bi-telephone-fill' /></InputGroup.Text>
                <MyFormControl type='tel' label='Phone number' required={false} register={register('phone', { ...phoneValid })} errors={errors} />
            </InputGroup>

            {/* Address */}
            <InputGroup className='mt-3'>
                <InputGroup.Text><i className='bi bi-geo-alt-fill' /></InputGroup.Text>
                <MyFormControl type='text' label='Address' register={register('address', { ...required, ...nameValid })} errors={errors} />
            </InputGroup>
            <small className='text-danger my-0'>* Required</small>

            <Stack className='mt-4' direction='horizontal' gap={3}>
                {showCancel ? <Button className='w-50' variant='outline-dark' size='lg' onClick={handleClose}>Cancel</Button> : null}
                <Button
                    className={showCancel ? 'w-50' : 'w-100'}
                    variant={confirm ? 'success' : 'primary'}
                    size='lg'
                    type='button'
                    onClick={handleSubmitClick}
                    onBlur={() => { if (confirm === 1) setConfirm(0) }}
                >
                    {(confirm === 0) ? 'Contact Sales' : ((confirm === 1) ? 'Confirm?' :
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                    )}
                </Button>
            </Stack>
        </Form>
        <SuccessModal {...successStatus} handleClose={() => { setSuccessStatus({ show: false }); handleClose(); }} />
    </>);
}