import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui";

interface TablePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const TablePagination = ({
  page,
  totalPages,
  onPageChange,
}: TablePaginationProps) => {
  if (totalPages <= 1) return null;

  const goTo = (p: number) => {
    if (p >= 1 && p <= totalPages) onPageChange(p);
  };

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goTo(page - 1);
            }}
          />
        </PaginationItem>

        {/* First Page */}
        <PaginationItem>
          <PaginationLink
            href="#"
            isActive={page === 1}
            onClick={(e) => {
              e.preventDefault();
              goTo(1);
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>

        {/* Ellipsis */}
        {page > 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Middle dynamic pages */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p !== 1 && p !== totalPages)
          .filter((p) => Math.abs(page - p) <= 1)
          .map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                isActive={page === p}
                onClick={(e) => {
                  e.preventDefault();
                  goTo(p);
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}

        {/* Ellipsis */}
        {page < totalPages - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Last Page */}
        {totalPages > 1 && (
          <PaginationItem>
            <PaginationLink
              href="#"
              isActive={page === totalPages}
              onClick={(e) => {
                e.preventDefault();
                goTo(totalPages);
              }}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goTo(page + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
