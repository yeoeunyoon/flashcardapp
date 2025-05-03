import Header from "@/components/header";
import Decks from "@/components/decks";

const Feed = () => {
  return (
    <div className="flex flex-col w-full min-h-screen border-x">
      <Header />
      <Decks />
    </div>
  );
};

export default Feed;