import { z } from "zod";

export const createDeckSchema = z.object({
  title: z
  .string()
  .min(1, {message: "Title is required"})
  .max(100, {message: "Title must be 1-100 characters long"})
  .regex(/^[a-zA-Z0-9 ]*$/, { message: "Title can only contain alphanumeric characters and spaces" }),
  date: z.string().optional(),
});

export const updateDeckSchema = createDeckSchema.partial();

export const getDeckSchema = z.object({
  deckId: z.coerce.number().int().positive(),
  date: z.string().optional(),
});

export const createCardSchema = z.object({
  front: z
  .string()
  .min(1)
  .max(500, "Front text must be 1-500 characters long"),
  back: z
  .string()
  .min(1)
  .max(1000, "Back text must be 1-1000 characters long"),
});

export const updateCardSchema = createCardSchema.partial();

export const getCardsSchema = z.object({
  deckId: z.coerce.number().int().positive(),
});

export const getCardSchema = z.object({
  deckId: z.coerce.number().int().positive(),
  cardId: z.coerce.number().int().positive(),
});

export const queryParamsSchema = z.object({
  sort: z.enum(["asc", "desc"]).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  username: z.string().optional(),
});

// Other schemas

export const signUpSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be 20 characters or less"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be 50 characters or less"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine(
      (value) => {
        return (
          /[a-z]/.test(value) && /[A-Z]/.test(value) && /[0-9]/.test(value)
        );
      },
      {
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, and one number",
      },
    ),
});

export const signInSchema = z.object({
  username: z.string(),
  password: z.string(),
});

