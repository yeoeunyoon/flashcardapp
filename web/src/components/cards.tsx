import { useState, useEffect } from "react";
import useQueryCards from "@/hooks/use-query-cards";
import Card from "@/components/card";
import { Pagination } from "@/components/ui/pagination";

type CardsProps = {
  deckId: string;
};

const Cards = ({ deckId }: CardsProps) => {
  const { cards, meta, setPage, loading } = useQueryCards(deckId, 1);
  const [error, setError] = useState<string | null>(null);

  // 에러 처리
  useEffect(() => {
    if (!deckId) {
      setError("Deck not found.");
    } else {
      setError(null);
    }
  }, [deckId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!cards.length) {
    return <p>No cards available.</p>;
  }

  return (
    <div className="p-4">
      {/* 카드 목록 렌더링 */}
      {cards.map((card) => (
        <Card key={card.id} card={card} />
      ))}

      {/* Pagination 컴포넌트 */}
      <Pagination
        page={meta?.page || 1}
        totalPages={meta?.totalPages || 1}
        onPageChange={(newPage: number) => setPage(newPage)} // 페이지 변경
      />
    </div>
  );
};

export default Cards;
