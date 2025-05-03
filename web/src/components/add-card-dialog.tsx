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
import  useMutationCards  from "@/hooks/use-mutation-cards";
import { useParams } from "react-router-dom";
import {useState} from "react";

const AddCardDialog = () => {
  const [front, setFront] = useState(""); // State for front content
  const [back, setBack] = useState(""); // State for back content
  const [isOpen, setIsOpen] = useState(false); // State to manage dialog visibility
  const { addNewCard } = useMutationCards(); // Mutation hook to create a card
  const { deckId } = useParams<{ deckId: string }>(); // Get deckId from URL params

  const handleSave = async () => {
    await addNewCard(deckId!, front, back); // Save the new card
    setFront(""); // Clear front content
    setBack(""); // Clear back content
    setIsOpen(false); // Close the dialog
  };

  const handleCancel = () => {
    setFront(""); // Clear front content
    setBack(""); // Clear back content
    setIsOpen(false); // Close the dialog
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open); // Update dialog visibility
        if (!open) {
          setFront(""); // Reset front content
          setBack(""); // Reset back content
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="icon"
          onClick={() => setIsOpen(true)} // Open the dialog
          className="bg-red-500"
        >
          +
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Card</DialogTitle>
          <DialogDescription>Write the card content below!</DialogDescription>
        </DialogHeader>
        <Input
          value={front}
          onChange={(e) => setFront(e.target.value)} // Update front content
          placeholder="Front content"
        />
        <Input
          value={back}
          onChange={(e) => setBack(e.target.value)} // Update back content
          placeholder="Back content"
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

export default AddCardDialog;
