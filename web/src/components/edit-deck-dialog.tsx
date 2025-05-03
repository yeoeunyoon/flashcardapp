import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import useMutationDecks from "@/hooks/use-mutation-decks";
import { DeckType } from "@/data/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"; 

type EditDeckDialogProps = {
  deck: DeckType;
  setIsEditing: (editing: boolean) => void;
};

const EditDeckDialog = ({ deck, setIsEditing }: EditDeckDialogProps) => {
  const [title, setTitle] = useState(deck.title);
  const { edittedDeck } = useMutationDecks();

  const handleSave = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    await edittedDeck(deck.id, title);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <Dialog open={true} onOpenChange={() => setIsEditing(false)}>
      <DialogContent className="z-50">
        <DialogHeader>
          <DialogTitle>Edit Deck</DialogTitle>
          <DialogDescription>Edit the title of your deck here.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-4 mt-4 ml-10">
          <Label htmlFor="deckTitle" className="text-sm">Title</Label>
          <Input
            id="deckTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            className="flex-1"
          />
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditDeckDialog;
