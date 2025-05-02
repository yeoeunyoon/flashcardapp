import { API_URL } from "@/env";
import { DeckType, CardType } from "./types";
import type { UserType} from "./types";

// Fetch all decks
export const fetchDecks = async (
  page: number,
  limit: number,
  search = "" 
): Promise<{
  data: DeckType[];
  meta: { page: number; limit: number; totalPages: number; totalCount: number };
}> => {
  const response = await fetch(
    `${API_URL}/decks?sort=desc&page=${page}&limit=${limit}&search=${search}`, 
    {
      method: "GET",
      headers: { "Cache-Control": "no-cache" },
    }
  );
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  const { data, meta } = await response.json();
  return {
    data: data.map((deck: DeckType) => ({
      ...deck,
      numberOfCards: deck.numberOfCards ?? 0, 
      date: deck.date,
    })),
    meta,
  };
};

// Delete a deck by ID
export const deleteDeck = async (id: string): Promise<boolean> => {
  const response = await fetch(`${API_URL}/decks/${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  return true; 
};

// Create a new deck
export const createDeck = async (title: string): Promise<DeckType> => {
  const deckData = {
    id: null,
    title,
    numberOfCards: 0,
  };
  const response = await fetch(`${API_URL}/decks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(deckData),
  });
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  const data = await response.json();
  return {
    id: data.id,
    title: data.title,
    numberOfCards: data.numberOfCards,
    date: data.date,
  };
};

// Update a deck
export const editDeck = async (id: string, title: string): Promise<DeckType> => {
  const response = await fetch(`${API_URL}/decks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  const data: DeckType = await response.json();
  return data;
};

// Fetch all cards
export const fetchCards = async (
  deckId: string,
  page: number,
  limit: number
): Promise<{ data: CardType[]; meta: { page: number; limit: number; totalPages: number; totalCount: number } }> => {
  const response = await fetch(`${API_URL}/decks/${deckId}/cards?page=${page}&limit=${limit}`);
  if (!response.ok) {
    throw new Error(`Error fetching cards: ${response.status}`);
  }
  const result = await response.json();
  return {
    data: result.data,
    meta: result.meta,
  };
};

// Create a new card
export const createCard = async (
  deckId: string,
  front: string,
  back: string
): Promise<CardType> => {
  const response = await fetch(`${API_URL}/decks/${deckId}/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ front, back }),
  });
  if (!response.ok) {
    throw new Error(`Failed to create card: ${response.status}`);
  }
  const data = await response.json();
  return {
    id: data.id,
    front: data.front,
    back: data.back,
    deckId: data.deckId,
    date: data.date,
  };
};

// Update a card
export const editCard = async (
  deckId: string,
  cardId: string,
  front: string,
  back: string
): Promise<CardType> => {
  const response = await fetch(`${API_URL}/decks/${deckId}/cards/${cardId}`, {
    method: "PATCH", 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ front, back }),
  });
  if (!response.ok) {
    throw new Error(`Failed to update card: ${response.status}`);
  }
  const data = await response.json();
  return {
    id: data.id,
    front: data.front,
    back: data.back,
    deckId: data.deckId,
    date: data.date,
  };
};

// Delete a card
export const deleteCard = async (deckId: string, cardId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/decks/${deckId}/cards/${cardId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete card: ${response.status}`);
  }
};

// Sign up a user
export const signUp = async (
  name: string,
  username: string,
  password: string,
): Promise<UserType> => {
  const response = await fetch(`${API_URL}/sign-up`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, username, password }),
    credentials: "include", 
  });
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  const { user }: { user: UserType } = await response.json();
  return user;
};
 
// Sign in a user
export const signIn = async (
  username: string,
  password: string,
): Promise<UserType> => {
  const response = await fetch(`${API_URL}/sign-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include", 
  });
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  const { user }: { user: UserType } = await response.json();
  return user;
};
 
// Sign out a user
export const signOut = async (): Promise<boolean> => {
  const response = await fetch(`${API_URL}/sign-out`, {
    method: "POST",
    credentials: "include", 
  });
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  return true;
};

