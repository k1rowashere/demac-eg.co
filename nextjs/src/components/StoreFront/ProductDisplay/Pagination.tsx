import { Pagination } from "react-bootstrap";

export default function _Pagination({ pageCount, currentPage, onPageChange }: { pageCount: number, currentPage: number, onPageChange: (page: number) => void }) {
    let items = [];
    for (let i = 1; i <= pageCount; i++) {
        items.push(
            <Pagination.Item key={i} active={i === currentPage} onClick={() => onPageChange(i)}>{i}</Pagination.Item>
        );
    }

    if (items.length > 8) {
        // DO NOT TOUCH THIS: pagination splitting logic
        return (
            <Pagination className='align-self-end justify-content-center'>
                <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />
                {items[0]}
                {!(currentPage - 2 <= 1) && <Pagination.Ellipsis disabled />}
                {items.slice(
                    (currentPage + 2 > pageCount - 1) ? (currentPage + (pageCount - currentPage - 4)) : Math.max(currentPage - 2, 1),
                    (currentPage - 4 < 1) ? (currentPage + (1 - currentPage + 4)) : Math.min(currentPage + 1, pageCount - 1)
                )}

                {!(currentPage + 2 >= pageCount) && <Pagination.Ellipsis disabled />}
                {items[pageCount - 1]}

                <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === pageCount} />
            </Pagination>
        );
    } else {
        return (
            <Pagination className='align-self-end justify-content-center'>
                <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />
                {items}
                <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === pageCount} />
            </Pagination>
        );
    }


}