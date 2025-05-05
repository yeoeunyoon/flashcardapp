import { Hono } from "hono";
import { db } from "../db";
import { cards, users } from "../db/schema";
import { decks } from "../db/schema";
import { eq, like, count, SQL, and } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { 
    createCardSchema, 
    updateCardSchema, 
    getCardSchema, 
    getCardsSchema, 
    queryParamsSchema 
} from "../validators/schemas";
import type { Context } from "../lib/context.js";
import { authGuard } from "../middleware/auth-guard";

const cardRoutes = new Hono<Context>();

// Get all cards in a deck
cardRoutes.get(
    "/decks/:deckId/cards",
    authGuard,
    zValidator("param", getCardsSchema),
    zValidator("query", queryParamsSchema),
    async (c) => {
      const { deckId } = c.req.valid("param");
      const {search, page = 1, limit = 10 , username} = c.req.valid("query");
  
      const whereClause: (SQL | undefined)[] = [];
      whereClause.push(eq(cards.deckId, deckId));
      if (search) {
        whereClause.push(like(cards.front, `%${search}%`));
      }
      if (username) {
        const user = await db
          .select()
          .from(users)
          .where(eq(users.username, username))
          .get();

          if (!user) {
            throw new HTTPException(404, { message: "User not found" });
          }

          whereClause.push(eq(cards.userId, user.id));
      }
  
      const offset = (page - 1) * limit;
  
      const [allCards, [{ totalCount }]] = await Promise.all([
        db
          .select()
          .from(cards)
          .where(eq(cards.deckId, deckId))
          .limit(limit)
          .offset(offset),
        db
          .select({ totalCount: count() })
          .from(cards)
          .where(eq(cards.deckId, deckId)),
      ]);
  
      return c.json({
        data: allCards,
        page,
        limit,
        total: totalCount,
      });
    },
  );
  
  // Get a single card by id for a deck
  cardRoutes.get(
    "/decks/:deckId/cards/:cardId",
    authGuard,
    zValidator("param", getCardSchema),
    async (c) => {
      const { deckId, cardId } = c.req.valid("param");
      const card = await db
        .select()
        .from(cards)
        .where(and(eq(cards.id, cardId), eq(cards.deckId, deckId)))
        .get();
      if (!card) {
        throw new HTTPException(404, { message: "Card not found" });
      }
      return c.json(card);
    },
  );
  
  // Delete a card by id for a deck
  cardRoutes.delete(
    "/decks/:deckId/cards/:cardId",
    authGuard,
    zValidator("param", getCardSchema),
    async (c) => {
      const { deckId, cardId } = c.req.valid("param");
      const user = c.get("user");
      const deletedCard = await db
        .delete(cards)
        .where(and(eq(cards.id, cardId), eq(cards.deckId, deckId)))
        .returning()
        .get();
      if (!deletedCard) {
        throw new HTTPException(404, { message: "Card not found" });
      }
      if (deletedCard.userId !== user!.id) {
        throw new HTTPException(403, {
          message: "Unauthorized to delete this card",
        });
      }
      return c.json(deletedCard);
    },
  );
  
  // Create a new card in a deck
  cardRoutes.post(
    "/decks/:deckId/cards",
    authGuard,
    zValidator("param", getCardsSchema),
    zValidator("json", createCardSchema),
    async (c) => {
      const { deckId } = c.req.valid("param");
      const { front, back } = c.req.valid("json");
      const user = c.get("user"); 

      const currentTimeStamp = new Date().toISOString();
      const deckExists = await db
        .select()
        .from(decks)
        .where(eq(decks.id, deckId))
        .get();

      if (!deckExists) {
        throw new HTTPException(404, {message: "Deck not found"});
      }  
      const newCard = await db
        .insert(cards)
        .values({
          front,
          back,
          deckId,
          date: currentTimeStamp,
          userId: user!.id,
        })
        .returning()
        .get();
  
      return c.json(newCard,201);
    },
  );
  
  // Update a card by id for a deck
  cardRoutes.patch(
    "/decks/:deckId/cards/:cardId",
    zValidator("param", getCardSchema),
    zValidator("json", updateCardSchema),
    async (c) => {
      const { deckId, cardId } = c.req.valid("param");
      const { front, back } = c.req.valid("json");
      const user = c.get("user");
      const updatedCard = await db
        .update(cards)
        .set({ front, back})
        .where(and(eq(cards.id, cardId), eq(cards.deckId, deckId)))
        .returning()
        .get();
  
      if (!updatedCard) {
        throw new HTTPException(404, { message: "Card not found" });
      }
      if (updatedCard.userId !== user!.id) {
        throw new HTTPException(403, {
          message: "Unauthorized to update this card",
        });
      }
      return c.json(updatedCard);
    },
  );
  
  export default cardRoutes;