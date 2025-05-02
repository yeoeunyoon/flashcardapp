import { useParams } from "react-router-dom";
import useQueryCards from "@/hooks/use-query-cards";
import { Pagination } from "@/components/ui/pagination";
import Card from "@/components/card";
import { useState } from "react";

const CardsPage = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const [page, setPage] = useState(1);

  if (!deckId) {
    return <p> Invalid deckID entered.</p>;
  }

  const {cards, meta, loading, error} = useQueryCards(deckId,page);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Cannot load cards.</p>;
  if (!meta) return <p>Cannot load meta data.</p>;
  if (!cards.length) return <p>No cards available.</p>;


  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Cards in Deck</h2>
        <button className="px-3 py-1 text-white bg-blue-500 rounded">
          Add Card
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
      <Pagination
        page={meta.page}
        totalPages={meta.totalPages}
        onPageChange={(newPage: number) => setPage(newPage)}
      />
    </div>
  );
};

export default CardsPage;
