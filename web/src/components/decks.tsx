import Deck from "./deck";
import useQueryDecks from "@/hooks/use-query-decks";
import { Pagination, PaginationPrevious, PaginationNext, PaginationItem, PaginationLink } from "@/components/ui/pagination";

const Decks = () => {
  const { decks, meta, setPage, loading } = useQueryDecks();

  if (loading) {
    return <p>Loading...</p>
  }

  if (decks.length === 0){
    return <p>No decks available.</p>
  }

  return (
    <div className="p-4">
      {/* Deck List */}
      {decks.map((deck) => (
        <Deck key={deck.id} deck={deck} />
      ))}

      {/* Pagination */}
      <Pagination 
        page = {meta.page}
        totalPages = {meta.totalPages}
        onPageChange = {(newPage: number) => setPage(newPage)}
        className="flex justify-center mt-6">
        {/* Previous Button */}
        <PaginationPrevious
          onClick={meta.page > 1 ? () => setPage(meta.page - 1) : undefined}
          className={meta.page === 1 ? "opacity-50 pointer-events-none" : "mr-2"}
        />

        {/*Page Numbers*/}
        {Array.from({ length: meta.totalPages }, (_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              href="#"
              isActive={meta.page === index + 1}
              onClick={(e) => {
                e.preventDefault();
                setPage(index + 1);
              }}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        {/* Next Button */}
        <PaginationNext
          onClick={meta.page < meta.totalPages ? () => setPage(meta.page + 1) : undefined}
          className={meta.page === meta.totalPages ? "opacity-50 pointer-events-none" : "ml-2"}
        />
      </Pagination>
    </div>
  );
};

export default Decks;