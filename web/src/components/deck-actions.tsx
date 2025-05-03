import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import DeleteDeckDialog from "@/components/delete-deck-dialog"; // DeleteDeckDialog import
import useMutationDecks from "@/hooks/use-mutation-decks"; // Mutation hooks
import { DeckType } from "@/data/types";
import { useState } from "react";

type DeckActionsProps = {
  deck: DeckType;
  onEdit: () => void;
};

const DeckActions = ({ deck, onEdit }: DeckActionsProps) => {
  const { deleteDeckById } = useMutationDecks();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteDeckById(deck.id); // API 요청으로 Deck 삭제
      setIsDialogOpen(false); // Dialog 닫기
    } catch (error) {
      console.error("Failed to delete deck:", error);
    }
  };

  return (
    <>
      {/* Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <DotsVerticalIcon className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => setIsDialogOpen(true)} // Dialog 열기
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Dialog */}
      <DeleteDeckDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)} // Dialog 닫기 핸들러
        onConfirm={handleDelete} // 삭제 확인 핸들러
      />
    </>
  );
};

export default DeckActions;
