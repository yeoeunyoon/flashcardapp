export interface DeckType {
  id: string;
  title: string;
  numberOfCards: number;
  date: string;
}

export interface CardType {
  id: string; 
  front: string;
  back: string; 
  deckId: string; 
  date: string;
}

export type UserType = {
  id: string;
  name: string;
  username: string;
};