import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { CardType } from "@/data/types";
import useMutationCards from "@/hooks/use-mutation-cards";

const EditCardDialog = ({
  card,
  isOpen,
  closeModal,
}: {
  card: CardType;
  isOpen: boolean;
  closeModal: () => void;
}) => {
  const [front, setFront] = useState(card.front);
  const [back, setBack] = useState(card.back);
  const { edit } = useMutationCards();

  const handleSave = async () => {
    await edit(card.deckId, card.id, front, back );
    closeModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <div>
        <h2 className="text-lg font-semibold">Edit Card</h2>
        <div className="my-4">
          <Input
            value={front}
            onChange={(e) => setFront(e.target.value)}
            placeholder="Front content"
          />
        </div>
        <div className="my-4">
          <Input
            value={back}
            onChange={(e) => setBack(e.target.value)}
            placeholder="Back content"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </Dialog>
  );
};

export default EditCardDialog;
