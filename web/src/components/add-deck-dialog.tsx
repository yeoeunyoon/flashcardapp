import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useMutationDecks from "@/hooks/use-mutation-decks";
import {useState} from "react";

const AddDeckDialog = () => {
  const [title, setTitle] = useState(""); // State for deck title
  const [isOpen, setIsOpen] = useState(false); // State to manage dialog visibility
  const { addNewDeck } = useMutationDecks(); // Mutation hook to create a deck

  const handleSave = async () => {
    await addNewDeck(title); // Save the new deck
    setTitle(""); // Clear the title
    setIsOpen(false); // Close the dialog
  };

  const handleCancel = () => {
    setTitle(""); // Clear the title
    setIsOpen(false); // Close the dialog
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open); // Update dialog visibility
        if (!open) setTitle(""); // Reset title when dialog closes
      }}
    >
      <DialogTrigger asChild>
        <Button variant="default" size="icon" onClick={() => setIsOpen(true)}>
          +
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Deck</DialogTitle>
          <DialogDescription>Write the title below!</DialogDescription>
        </DialogHeader>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)} // Update title
          placeholder="Enter deck title"
          onKeyDown={(e) => e.key === "Enter" && handleSave()} // Save on Enter
        />
        <DialogFooter>
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDeckDialog;
