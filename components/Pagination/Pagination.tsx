import ReactPaginate from 'react-paginate';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (selectedPage: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <ReactPaginate
      nextLabel="→"
      previousLabel="←"
      breakLabel="..."
      pageCount={totalPages}
      forcePage={currentPage - 1}
      onPageChange={(e) => onPageChange(e.selected + 1)}
      containerClassName={styles.pagination}
      pageLinkClassName={styles.page}
      previousLinkClassName={styles.previous}
      nextLinkClassName={styles.next}
      breakLinkClassName={styles.break}
      activeLinkClassName={styles.active}
      disabledLinkClassName={styles.disabled}
      renderOnZeroPageCount={null}
    />
  );
}
