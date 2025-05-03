import { signIn, signOut, signUp, validateSession } from "@/data/api";
import { useStore } from "@nanostores/react";
import { $user, clearUser, setUser } from "@/lib/store";
import { toast } from "@/components/ui/use-toast";
import { redirectPage } from "@nanostores/router";
import { $router } from "@/lib/router";

function useAuth() {
  const user = useStore($user);

  const checkSession = async () => {
    try {
      const data = await validateSession();
      if (data.valid) {
        setUser(data.user);
        return true;
      } else {
        clearUser();
        redirectPage($router, "login");
        return false;
      }
    } catch (error) {
      clearUser();
      redirectPage($router, "login");
      return false;
    }
  };

  const login = async (username: string, password: string) => {
    try {
      if (!username || !password) {
        throw new Error("Username and password are required!");
      }
      const data = await signIn(username, password);
      setUser(data);
      redirectPage($router, "home");
    } catch (error) {
      const errorMessage =
        (error as Error).message ?? "Please try again later!";
      toast({
        variant: "destructive",
        title: "Sorry! There was an error signing in 🙁",
        description: errorMessage,
      });
    }
  };

  const register = async (name: string, username: string, password: string) => {
    try {
      if (!name || !username || !password) {
        throw new Error("Name, username, and password are required!");
      }
      const data = await signUp(name, username, password);
      setUser(data);
      redirectPage($router, "home");
    } catch (error) {
      const errorMessage =
        (error as Error).message ?? "Please try again later!";
      toast({
        variant: "destructive",
        title: "Sorry! There was an error signing up 🙁",
        description: errorMessage,
      });
    }
  };

  const logout = async () => {
    try {
      await signOut();
      clearUser();
      redirectPage($router, "login");
    } catch (error) {
      const errorMessage =
        (error as Error).message ?? "Please try again later!";
      toast({
        variant: "destructive",
        title: "Sorry! There was an error signing out 🙁",
        description: errorMessage,
      });
    }
  };

  return { user, login, register, logout, checkSession };
}

export default useAuth;