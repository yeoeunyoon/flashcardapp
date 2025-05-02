import { Hono } from "hono";
import { db } from "../db";
import { decks } from "../db/schema";
import { cards } from "../db/schema"
import { eq, asc, desc, like, count, sql, and } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";
import { 
    createDeckSchema, 
    updateDeckSchema, 
    getDeckSchema, 
    queryParamsSchema } from "../validators/schemas";
import type { Context } from "../lib/context.js";
import { authGuard } from "../middleware/auth-guard";

const deckRoutes = new Hono<Context>();

// Get all decks
deckRoutes.get(
  "/decks",
  zValidator("query", queryParamsSchema),
  async (c) => {
    const { search, page = 1, limit = 10 , sort = "asc"} = c.req.valid("query");

    const offset = (page - 1) * limit;
    const whereClause = search ? [like(decks.title, `%${search}%`)] : [];

    const [allDecks, [{ totalCount }]] = await Promise.all([
      db
        .select({
          id: decks.id,
          title: decks.title,
          date: decks.date,
          numberOfCards: sql`(SELECT COUNT(*) FROM cards WHERE cards.deck_id = decks.id)`.as("numberOfCards"),
        })
        .from(decks)
        .where(and(...whereClause))
        .groupBy(decks.id)
        .orderBy(decks.date)
        .limit(limit)
        .offset(offset),
      db
        .select({ totalCount: count() })
        .from(decks)
        .where(and(...whereClause)),
    ]);

    const totalPages = totalCount > 0 ? Math.ceil(totalCount / limit): 0;

    return c.json({
      success: true,
      message: "Decks retrieved successfully",
      data: allDecks,
      meta: {
        page,
        limit,
        totalPages,
        totalCount,
      }
    });
  },
);

// Get a single deck by ID
deckRoutes.get(
  "/decks/:deckId",
  zValidator("param", getDeckSchema),
  async (c) => {
    const { deckId } = c.req.valid("param");
    const deck = await db.select().from(decks).where(eq(decks.id, deckId)).get();
    if (!deck) {
      return c.json(
        { 
          success: false,
          message: "Deck not found",
          meta: {deckId},
        },
      404
    );
    }

    const [{totalCards}] = await db
      .select({
        totalCards: count(),
      })
      .from(cards)
      .where(eq(cards.deckId, deckId));

    return c.json({
      success: true,
      message: "Deck retrieved successfully",
      data: {
        ...deck,
        numberOfCards: totalCards,
      },
      meta: {deckId},
    });

  },
);

// Get all cards for a specific deck
deckRoutes.get(
  "/decks/:deckId/cards",
  authGuard,
  zValidator("query", queryParamsSchema),
  zValidator("param", getDeckSchema),
  async (c) => {
    const { deckId } = c.req.valid("param");
    const deck = await db.select().from(decks).where(eq(decks.id, deckId)).get();
    if (!deck) {
      return c.json(
        {
          success: false,
          message: "Deck not found",
        },
        404
      );
    }
    const { sort = "asc", search = "", page = 1, limit = 10 } = c.req.valid("query"); // 쿼리 파라미터 가져오기

    const offset = (page - 1) * limit;
    const whereConditions = [eq(cards.deckId, deckId)];

    // 검색 조건 추가
    if (search) {
      whereConditions.push(like(cards.front, `%${search}%`)); // front 검색
      whereConditions.push(like(cards.back, `%${search}%`)); // back 검색
    }

    const finalWhereCondition =
      whereConditions.length > 1
        ? and(...whereConditions) // 여러 조건을 `and`로 결합
        : whereConditions[0];

    const [allCards, [{ totalCount }]] = await Promise.all([
      db
        .select()
        .from(cards)
        .where(finalWhereCondition) // 조건 필터링
        .orderBy(sort === "desc" ? desc(cards.id) : asc(cards.id)) // 정렬
        .limit(limit) // limit 적용
        .offset(offset), // offset 적용
      db
        .select({ totalCount: count() }) // 총 카드 개수 가져오기
        .from(cards)
        .where(finalWhereCondition),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return c.json({
      success: true,
      message: "Cards retrieved successfully",
      data: allCards,
      meta: {
        page,
        limit,
        totalPages,
        totalCount,
      },
    });
  },
);


// Create a new deck
deckRoutes.post(
  "/decks",
  authGuard,
  zValidator("json", createDeckSchema),
  async (c) => {
    const { title } = c.req.valid("json");
    const currentTimeStamp = new Date().toISOString();
    const user = c.get("user");
    const newDeck = await db
        .insert(decks)
        .values({ title, date : currentTimeStamp, userId: user!.id,})
        .returning()
        .get();

    return c.json({
      success: true,
      message: "Deck created successfully",
      data: newDeck,
    }, 201);
  },
);

// Update a deck by ID
deckRoutes.patch(
  "/decks/:deckId",
  authGuard,
  zValidator("param", getDeckSchema),
  zValidator("json", updateDeckSchema),
  async (c) => {
    const { deckId } = c.req.valid("param");
    const { title } = c.req.valid("json");
    const user = c.get("user");

    const existingDeck = await db.select().from(decks).where(eq(decks.id, deckId)).get();
    if (!existingDeck) {
      return c.json(
        {
          success: false,
          message: "Deck not found",
        },
        404
      );
    }

    if (existingDeck.userId !== user!.id) {
      throw new HTTPException(403, {
        message: "Unauthorized to update this deck",
      });
    }

    const updatedDeck = await db
        .update(decks)
        .set({ title })
        .where(eq(decks.id, deckId))
        .returning()
        .get();
    if (!updatedDeck) {
      throw new HTTPException(404, { message: "Deck not found" });
    }
    return c.json({
      success: true,
      message: "Deck updated successfully",
      data: updatedDeck,
    })
  },
);

// Delete a deck by ID
deckRoutes.delete(
  "/decks/:deckId",
  authGuard,
  zValidator("param", getDeckSchema),
  async (c) => {
    const { deckId } = c.req.valid("param");
    const user = c.get("user");
    await db
        .delete(cards)
        .where(eq(cards.deckId, deckId));
    const deletedDeck = await db
        .delete(decks)
        .where(eq(decks.id, deckId))
        .returning()
        .get();
    if (!deletedDeck) {
      throw new HTTPException(404, { message: "Deck not found" });
    }
    if (deletedDeck.userId !== user!.id) {
      throw new HTTPException(403, {
        message: "Unauthorized to delete this deck",
      });
    }
    return c.json(
      {
        success: true,
        message: "Deck deleted successfully",
        data: deletedDeck,
      }
    );
  },
);

deckRoutes.onError((err, c) => {
  if (err instanceof ZodError) {
    const issues = err.errors.map((issue) => {

      const baseIssue = {
        code: issue.code,
        path: issue.path,
        message: issue.message,
      };

      if (issue.code === "invalid_type") {
        return {
          ...baseIssue,
          expected: issue.expected,
          received: issue.received,
        };
      }
      return baseIssue;

    });

    return c.json(
      {
        success: false,
        message: issues.map((issue) => issue.message).join(", "),
        meta: {
          issues,
          name: "ZodError",
        },
      },
      400
    );
  }
  if (err instanceof HTTPException) {
    return c.json(
      {
        success: false,
        message: err.message,
        meta: {statusCode: err.status},
      },
      err.status
    );
  }

  return c.json(
    {
      success: false,
      message: "An unexpected error occured",
      meta: {statusCode: 500}
    },
    500
  );
});

export default deckRoutes;
