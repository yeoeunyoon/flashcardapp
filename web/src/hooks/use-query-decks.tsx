import { useState, useEffect } from "react";
import { fetchDecks } from "@/data/api";
import { toast } from "@/components/ui/use-toast";
import { DeckType } from "@/data/types";

export const useQueryDecks = () => {
  const [decks, setDecks] = useState<DeckType[]>([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalCount: 0,
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadDecks = async () => {
      setLoading(true);
      try {
        const output = await fetchDecks(page, 10);
        setDecks(output.data || []);
        setMeta(output.meta);
        setLoading(false);
      } catch (error) {
        const errorMessage = (error as Error).message ?? "NetworkError when attempting to fetch resource.";
        toast ({
          variant : "destructive",
          title: "Sorry! There was an error reading the decks 🙁",
          description: errorMessage,
        })
        setError(error as Error);
        setLoading(false);
      }
  };

    loadDecks();
  }, [page]);

  return { decks, meta, page, setPage, loading, error};
};

export default useQueryDecks;