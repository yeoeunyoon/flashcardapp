import { useState, useEffect } from "react";
import { fetchCards } from "@/data/api";
import { CardType } from "@/data/types";
import { toast } from "@/components/ui/use-toast";

const useQueryCards = (deckId: string, initialPage:number) => {
  const [cards, setCard] = useState<CardType[]>([]);
  const [meta, setMeta] = useState<{
    page: number;
    limit: number;
    totalPages: number;
    totalCount: number;
} | null > (null);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null> (null);

  useEffect(() => {
    const loadCards = async () => {
    setLoading(true);
    try {
      const output = await fetchCards(deckId, page, 10);
      setCard(output.data);
      setMeta(output.meta);
      setLoading(false);
    } catch (error) {
      const errorMessage = (error as Error).message ?? "NetworkError when attempting to fetch resource.";
      
      toast ({
        variant : "destructive",
        title: "Sorry! There was an error reading the cards 🙁",
        description: errorMessage,
      })
      setError(error as Error);
      setLoading(false);
    }
  };

    loadCards();
  }, [deckId, page]);

  return { cards, meta, page, loading, setPage, error};
};

export default useQueryCards;
