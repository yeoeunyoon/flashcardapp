import { createDeck, deleteDeck, editDeck } from "@/data/api"; // Import deck-related API functions
import { addDeck, removeDeck, updateDeck } from "@/lib/store"; // Import store functions for decks
import { toast } from "@/components/ui/use-toast";

function useMutationDecks() {
  const deleteDeckById = async (deckId: string) => {
    try {
      await deleteDeck(deckId); 
      removeDeck(deckId);
    } catch (error) {
      const errorMessage =
        (error as Error).message;
      toast({
        variant: "destructive",
        title: "Sorry! There was an error deleting the deck 🙁",
        description: errorMessage,
      });
    }
  };

  const addNewDeck = async (title: string) => {
    try {
      if (!title) {
        throw new Error("title error");
      }
      const newDeck = await createDeck(title);
      addDeck(newDeck); 
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes("title error")){
        toast({
          variant: "destructive",
          title: "Sorry! Title cannot be empty! 🙁",
          description: "Please enter a title for your deck.",
        });
      } else if (errorMessage.includes("NetworkError")) {
        toast({
          variant: "destructive",
          title: "Sorry! There was an error adding a new deck 🙁",
          description: "NetworkError when attempting to fetch resource.",
        });
      }
    }
  }


  const edittedDeck = async (deckId: string, title: string) => {
    try {
      if (!title) {
        throw new Error("Please enter a title for your deck.");
      }
      const updatedDeck = await editDeck(deckId, title); 
      updateDeck(updatedDeck); 
    } catch (error) {
      const errorMessage =
        (error as Error).message;
      toast({
        variant: "destructive",
        title: "Sorry! Title cannot be empty! 🙁",
        description: errorMessage,
      });
    }
  };

  return {
    deleteDeckById,
    addNewDeck,
    edittedDeck,
  };
}

export default useMutationDecks;
