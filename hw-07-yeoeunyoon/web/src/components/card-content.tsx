import React, { useState } from "react";
import { CardType } from "@/data/types";
import EditCardDialog from "@/components/edit-card-dialog";
import  useMutationCards from "@/hooks/use-mutation-cards";

interface CardContentProps {
  card: CardType;
}

const CardContent: React.FC<CardContentProps> = ({ card }) => {
  const [flipped, setFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { deletingCard } = useMutationCards();

  const handleFlip = () => setFlipped(!flipped);

  const handleDelete = async () => {
    try {
      await deletingCard(card.deckId, card.id);
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  return (
    <div className="p-4 bg-white border rounded-lg shadow-md">
      <div onClick={handleFlip} className="cursor-pointer">
        {flipped ? (
          <p className="text-gray-800">{card.back}</p>
        ) : (
          <p className="text-gray-800">{card.front}</p>
        )}
        <p className="mt-2 text-xs text-gray-500">
          Last updated: {new Date(card.date).toLocaleDateString()}
        </p>
      </div>
      <div className="flex mt-4 space-x-2">
        <button
          onClick={() => setIsEditing(true)}
          className="px-2 py-1 text-white bg-blue-500 rounded"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-2 py-1 text-white bg-red-500 rounded"
        >
          Delete
        </button>
      </div>
      {isEditing && (
        <EditCardDialog
          card={card}
          isOpen={isEditing}
          closeModal={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default CardContent;
