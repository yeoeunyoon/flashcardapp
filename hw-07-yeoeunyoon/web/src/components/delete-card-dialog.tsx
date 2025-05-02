import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { CardType } from "@/data/types";
import useMutationCards from "@/hooks/use-mutation-cards";

const DeleteCardDialog = ({
  card,
  closeModal,
}: {
  card: CardType;
  closeModal: () => void;
}) => {
  const { deletingCard } = useMutationCards();

  const handleDelete = async () => {
    await deletingCard(card.deckId, card.id);
    closeModal();
  };

  return (
    <Dialog open={true} onOpenChange={closeModal}>
      <div>
        <h2 className="text-lg font-semibold">Delete Card</h2>
        <p>Are you sure you want to delete this card?</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteCardDialog;
