import { useState } from "react";
import { CardType } from "@/data/types";
import EditCardDialog from "./edit-card-dialog";
import DeleteCardDialog from "./delete-card-dialog";

const Card = ({ card }: { card: CardType }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFlip = () => setIsFlipped((prev) => !prev);

  if (isEditing)
    return <EditCardDialog card={card} closeModal={() => setIsEditing(false)} />;
  if (isDeleting)
    return <DeleteCardDialog card={card} closeModal={() => setIsDeleting(false)} />;

  return (
    <div
      onClick={handleFlip}
      className="p-4 bg-gray-100 rounded shadow-md cursor-pointer"
    >
      <p>{isFlipped ? card.back : card.front}</p>
      <div className="flex justify-end gap-2 mt-2">
        <button
          className="text-blue-500"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
        >
          Edit
        </button>
        <button
          className="text-red-500"
          onClick={(e) => {
            e.stopPropagation();
            setIsDeleting(true);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Card;
