// imports
import { useRef } from 'react';
import { useRouter } from 'next/router';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

export default function SearchBtn({ className }: { className?: string }) {
    const router = useRouter();
    const searchRef = useRef<HTMLInputElement>(null);
    const handleSearch = () => {
        if (!searchRef.current?.value) return;
        router.push(
            {
                pathname: '/store/search',
                query: {
                    s: searchRef.current?.value || '',
                },
            },
            undefined,
            { scroll: false }
        );
    };
    const handleSearchEnter = (e: React.KeyboardEvent<Element>) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        handleSearch();
    };

    return (
        <InputGroup className={className}>
            <Button variant='success' title='search' onClick={handleSearch}>
                <i className='bi bi-search' />
            </Button>
            <FormControl
                ref={searchRef}
                defaultValue={router.query.s || ''}
                aria-label='search'
                aria-describedby='search'
                type='search'
                placeholder='Search'
                onFocus={(e: React.FocusEvent<HTMLInputElement>) => e.target.select()}
                onKeyDown={handleSearchEnter}
            />
        </InputGroup>
    );
}
