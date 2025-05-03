import { toast } from "@/components/ui/use-toast";
import { createCard, deleteCard, editCard } from "@/data/api";
import { addCard, removeCard, updateCard } from "@/lib/store";

const useMutationCards = () => {
  // Add a new card to a deck
  const addNewCard = async (deckId: string, front: string, back: string ) => {
    try {
      const newCardAdd = await createCard(deckId, front, back);
      addCard(newCardAdd);
    } catch (error) {
      const errorMessage = (error as Error).message;
      toast({
        title: "Sorry! There was an error adding a new card 🙁",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };


  // Edit an existing card
  const edit = async (deckId: string, cardId: string, front: string, back: string )=> {
    try {
      const newUpdateCard = await editCard(deckId, cardId, front, back);
      updateCard(newUpdateCard);
    } catch (error) {
      const errorMessage = (error as Error).message;
      toast({
        variant: "destructive",
        title: "Sorry! There was an error updating the card 🙁",
        description: errorMessage,
      });
    }
  };

  // Delete a card
  const deletingCard = async (deckId: string, cardId: string) => {
    try {
      await deleteCard(deckId, cardId);
      removeCard(cardId);
    } catch (error) {
      throw error;
    }
  };

  return { addNewCard, edit, deletingCard};
};

export default useMutationCards;
