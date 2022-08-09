import { Container } from "react-bootstrap";

export default function Header({ h1, h2, classNames }: { h1: string, h2?: string, classNames?: {parent?: string, child?: string} }) {
    return (
        <header className={classNames?.parent ?? 'bg-dark'}>
            <div className={'py-3 ' + (classNames?.child ?? '')}>
                <Container className='px-4 px-lg-5 my-5'>
                        <h1 className='display-4 fw-bolder text-uppercase text-white'>{h1}</h1>
                        {h2 && <h2 className='lead fw-normal text-white-50 mb-0'>{h2}</h2>}
                </Container>
            </div>
        </header>
    );
}
