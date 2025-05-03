import { useState } from "react";
import EditDeckDialog from "./edit-deck-dialog";
import { DeckType } from "@/data/types";
import DeckActions from "./deck-actions";

type DeckProps = {
  deck: DeckType;
};

const Deck = ({ deck }: DeckProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () =>
    setIsEditing(true);

  if (isEditing) {
    return <EditDeckDialog deck={deck} setIsEditing={setIsEditing} />;
  }

  return (
    <div className="relative flex items-center justify-between p-6 mb-6 rounded-lg shadow-md bg-card text-card-foreground">
      <div onDoubleClick = {handleEdit}>
        <h3 className="text-lg font-semibold">{deck.title}</h3>
        <p className="text-sm text-muted-foreground" style={{ paddingBottom: '7rem' }}>
          {deck.numberOfCards} cards
        </p>
        <p className="text-xs text-muted-foreground">
          {new Date(deck.date).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
        </p>
      </div>
      <div className="absolute top-4 right-4">
        <DeckActions deck={deck} onEdit={handleEdit} />
      </div>
    </div>

  );
};

export default Deck;
