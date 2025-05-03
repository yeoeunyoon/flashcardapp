import { atom } from "nanostores";
import {persistentMap} from "@nanostores/persistent";
import { DeckType, CardType} from "@/data/types";
import type { UserType } from "@/data/types";

export const $decks = atom<DeckType[]>([]);
export const $cards = atom<CardType[]>([]);

export function setDecks(decks: DeckType[]) {
    $decks.set(decks);
}
  
export function addDeck(deck: DeckType) {
  $decks.set([deck, ...$decks.get()]);
}

export function removeDeck(id: string) {
  $decks.set($decks.get().filter((deck) => deck.id !== id));
}

export function updateDeck(updatedDeck: DeckType){
  $decks.set(
    $decks
      .get()
      .map((deck) => (deck.id === updatedDeck.id ? updatedDeck : deck))
  );
};

export function setCard(cards: CardType[]){
  $cards.set(cards);
}

export function addCard(card : CardType) {
  $cards.set([card, ...$cards.get()]);
}

export function updateCard(updatedCard: CardType){
  $cards.set(
    $cards
      .get()
      .map((card) => (card.id === updatedCard.id ? updatedCard : card))
  );
};

export function removeCard(id: string) {
  $cards.set($cards.get().filter((card) => card.id !== id));
}

const defaultUser: UserType = {
  id: "",
  name: "",
  username: "",
};
export const $user = persistentMap<UserType>("user:", defaultUser);

export function setUser(user: UserType) {
  $user.set(user);
}

export function clearUser() {
  $user.set(defaultUser);
}