// src/components/sidebar.tsx
import {
  HomeIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import AddDeckDialog from "@/components/add-deck-dialog";
import AddCardDialog from "@/components/add-card-dialog";
import {useLocation, Link} from "react-router-dom";


const Sidebar = () => {
  const loc = useLocation();
  const onCardPage = loc.pathname.startsWith("/decks/");

  return (
    <div className="flex flex-col items-end p-2 space-y-2">
      <Button aria-label={"Home"} variant="ghost" size="icon">
        <Link to ="/">
          <HomeIcon className="w-5 h-5" />
        </Link>
      </Button>
      <Button aria-label={"Search"} variant="ghost" size="icon">
        <MagnifyingGlassIcon className="w-5 h-5" />
      </Button>
      {onCardPage ? <AddCardDialog /> : <AddDeckDialog />}
    </div>
  );
};

export default Sidebar;
