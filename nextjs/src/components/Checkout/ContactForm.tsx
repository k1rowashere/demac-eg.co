// form using formik that has first name, last name, company name, job title,  email, mobile number, phone number and address
import { Formik } from 'formik';
import { FormikHelpers, FormikProps } from 'formik/dist/types';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import MyFormControl from './MyFormControl';
import Stack from 'react-bootstrap/Stack';

import * as Yup from 'yup';

import 'yup-phone-lite';

import { contactInfo } from 'utils/types';

import { useRef, useState } from 'react';
import { Spinner } from 'react-bootstrap';

import ReCAPTCHA from 'react-google-recaptcha';

// formkit onSubmit type
type FormikOnSubmit<T> = (values: T, formikHelpers: FormikHelpers<T>) => void | Promise<any>;
type contactInfoWoutMessage = Omit<contactInfo, 'message'>;
type Props = {
    initialValues?: contactInfoWoutMessage;
    handleSubmit: (values: any) => Promise<void>;
    handleClose?: () => void;
    showCancel?: boolean;
};

const contactUsSchema = Yup.object().shape({
    firstName: Yup.string().required('Required').min(2, 'Too Short!').max(50, 'Too Long!'),
    lastName: Yup.string().required('Required').min(2, 'Too Short!').max(50, 'Too Long!'),
    companyName: Yup.string().required('Required').min(2, 'Too Short!').max(50, 'Too Long!'),
    jobTitle: Yup.string().required('Required').min(2, 'Too Short!').max(50, 'Too Long!'),
    email: Yup.string().required('Required').email('Invalid email'),
    // match phone number format with yup-phone
    mobileNumber: Yup.string().required('Required').phone('EG', 'Invalid phone number'),
    phoneNumber: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .matches(
            // numbers, spaces, dashes, parentheses, and plus signs
            /^[\d\s-()+]*$/,
            'Invalid phone number'
        ),
    address: Yup.string().required('Required').min(2, 'Too Short!').max(50, 'Too Long!'),
    captchaToken: Yup.string().required('Required'),
});

const emptyContactForm: contactInfoWoutMessage = {
    firstName: '',
    lastName: '',
    companyName: '',
    jobTitle: '',
    email: '',
    mobileNumber: '',
    phoneNumber: '',
    address: '',
    captchaToken: '',
};

const requiredFields = [
    'firstName',
    'lastName',
    'companyName',
    'jobTitle',
    'email',
    'mobileNumber',
    'address',
];

export default function ContactForm({
    initialValues = emptyContactForm,
    handleSubmit,
    handleClose = () => null,
    showCancel,
}: Props) {
    const [confirm, setConfirm] = useState(0); // 0: no clicks, 1: waiting for confirm, 2: loading
    const formRef = useRef<FormikProps<contactInfoWoutMessage>>(null);
    const captchaRef = useRef<ReCAPTCHA>(null);

    const handleSubmitClick = async () => {
        if (confirm === 0) {
            setConfirm(1);
        } else if (confirm === 1) {
            setConfirm(2);
            await formRef.current?.submitForm();
            setConfirm(0);
        }
    };

    // formik onSubmit
    const onSubmit: FormikOnSubmit<typeof initialValues> = async (values, { resetForm }) => {
        //reset captcha
        captchaRef.current?.reset();

        resetForm({ values: emptyContactForm });
        await handleSubmit(values);
    };

    return (
        <Formik
            innerRef={formRef}
            validationSchema={contactUsSchema}
            onSubmit={onSubmit}
            initialValues={{ ...initialValues, captchaToken: '' }}
        >
            {({ handleSubmit, handleChange, handleBlur, values, touched, isValid, errors }) => {
                const createFormControlProps = (
                    name: keyof typeof values,
                    label: string,
                    icon?: string
                ) => ({
                    required: requiredFields.includes(name),
                    name,
                    label,
                    icon,
                    value: values[name],
                    handleChange,
                    touched: touched[name],
                    error: errors[name],
                });

                const formControlProps = [
                    createFormControlProps('firstName', 'First Name'),
                    createFormControlProps('lastName', 'Last Name'),
                    createFormControlProps('companyName', 'Company Name', 'bi-building'),
                    createFormControlProps('jobTitle', 'Job Title', 'bi-briefcase'),
                    createFormControlProps('email', 'Email', 'bi-envelope'),
                    createFormControlProps('mobileNumber', 'Mobile Number', 'bi-phone'),
                    createFormControlProps('phoneNumber', 'Phone Number', 'bi-telephone'),
                    createFormControlProps('address', 'Address', 'bi-geo-alt'),
                ];

                return (
                    <>
                        <h3>Personal Info</h3>
                        <hr />
                        <Form noValidate onSubmit={handleSubmit}>
                            <Stack direction='horizontal' gap={3}>
                                {formControlProps.slice(0, 2).map((props) => (
                                    <MyFormControl key={props.name} {...props} />
                                ))}
                            </Stack>

                            {formControlProps.slice(2, 4).map((props) => (
                                <MyFormControl key={props.name} {...props} />
                            ))}
                            <h3>Contact Info</h3>
                            <hr />

                            <MyFormControl {...formControlProps[4]} />

                            <Stack direction='horizontal' gap={2} className='minBreakpoint-md'>
                                {formControlProps.slice(5, 7).map((props) => (
                                    <MyFormControl key={props.name} {...props} />
                                ))}
                            </Stack>

                            <MyFormControl {...formControlProps[7]} />

                            <ReCAPTCHA
                                ref={captchaRef}
                                className='mt-3'
                                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ''}
                                onChange={(token) => (values.captchaToken = token)}
                            />
                            {errors.captchaToken ? (
                                <p className='text-danger my-0 small'>
                                    Please verify that you are not a robot 🤖.
                                </p>
                            ) : null}
                            <Stack className='mt-4' direction='horizontal' gap={3}>
                                {showCancel ? (
                                    <Button
                                        className='w-50'
                                        variant='outline-dark'
                                        size='lg'
                                        onClick={handleClose}
                                    >
                                        Cancel
                                    </Button>
                                ) : null}
                                <Button
                                    className={showCancel ? 'w-50' : 'w-100'}
                                    variant={confirm ? 'success' : 'primary'}
                                    size='lg'
                                    type='button'
                                    onClick={handleSubmitClick}
                                    onBlur={() => {
                                        if (confirm === 1) setConfirm(0);
                                    }}
                                >
                                    {confirm === 0 ? (
                                        'Contact Sales'
                                    ) : confirm === 1 ? (
                                        'Confirm?'
                                    ) : (
                                        <Spinner
                                            as='span'
                                            animation='border'
                                            size='sm'
                                            role='status'
                                            aria-hidden='true'
                                        />
                                    )}
                                </Button>
                            </Stack>
                        </Form>
                    </>
                );
            }}
        </Formik>
    );
}
