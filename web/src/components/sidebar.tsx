// src/components/sidebar.tsx
import {
  HomeIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import AddDeckDialog from "@/components/add-deck-dialog";
import AddCardDialog from "@/components/add-card-dialog";
import {useLocation, Link} from "react-router-dom";
import { useStore } from "@nanostores/react";
import { $user } from "@/lib/store";
import useAuth from "@/hooks/use-auth";
import { LogOut } from "lucide-react";

const Sidebar = () => {
  const loc = useLocation();
  const onCardPage = loc.pathname.startsWith("/decks/");
  const user = useStore($user);
  const { logout } = useAuth();

  return (
    <div className="flex flex-col h-full p-4 border-r">
      <div className="flex-1">
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
      </div>
      {user && (
        <div className="flex flex-col gap-2 p-4 border-t">
          <p className="text-sm text-muted-foreground">
            Welcome, {user.name}
          </p>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
