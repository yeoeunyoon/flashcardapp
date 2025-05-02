import { BASE_URL } from "@/env";
import { createRouter } from "@nanostores/router";

export const $router = createRouter({
  home: `${BASE_URL}`, 
  deck: `${BASE_URL}decks/:deckId`, 
  login: `${BASE_URL}login`,
  register: `${BASE_URL}register`,
});
