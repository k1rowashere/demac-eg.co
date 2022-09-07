import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { FloatingLabel } from 'react-bootstrap';

type Props = {
    required: boolean;
    name: string;
    label: string;
    icon?: string;
    value: string | null | undefined;
    touched?: boolean;
    error?: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function MyFormControl2(props: Props) {
    const { required, name, value, handleChange, label, icon, touched, error } = props;
    return (
        <>
            <style>
                {`
                .form-floating .form-control:required ~ label::after {
                    content: ' *';
                    color: #dc3545;
                }
            `}
            </style>
            <InputGroup hasValidation className='mb-3'>
                {icon ? (
                    <InputGroup.Text>
                        <i className={'bi ' + icon} />
                    </InputGroup.Text>
                ) : null}
                <FloatingLabel label={label} controlId={label}>
                    <Form.Control
                        type={name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'text'}
                        name={name}
                        value={value || ''}
                        required={required}
                        onChange={handleChange}
                        isValid={touched && !error}
                        isInvalid={touched && !!error}
                        placeholder=''
                    />
                </FloatingLabel>
                <Form.Control.Feedback
                    tooltip
                    type='invalid'
                    style={{ display: touched && !!error ? 'block' : 'none' }}
                >
                    {error}
                </Form.Control.Feedback>
            </InputGroup>
        </>
    );
}
