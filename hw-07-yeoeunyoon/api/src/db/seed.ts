import { db, connection } from "./index";
import { decks, cards, users } from "./schema";
import { faker } from "@faker-js/faker";
import { sql } from "drizzle-orm";
import { hash } from "@node-rs/argon2";

async function seed() {
  console.log("Seeding the database...");

  // Clean the tables
  console.log("Cleaning existing data...");
  await db.delete(cards);
  await db.delete(decks);
  await db.delete(users);

  await db.run(
    sql`DELETE FROM sqlite_sequence WHERE name IN ('posts', 'comments', 'users')`,
  );

  console.log("Inserting new seed data...");

  const sampleKeywords = [
    "education",
    "science",
    "mathematics",
    "technology",
    "art",
    "literature",
    "history",
    "physics",
    "chemistry",
    "biology",
  ];

  // Create 10 sample users
  const sampleUsers = [];
  for (let i = 1; i <= 10; i++) {
    const user = await db
      .insert(users)
      .values({
        name: faker.person.fullName(),
        username: `user-${i}`,
        password_hash: await hash(`pass-${i}`),
      })
      .returning()
      .get();
    sampleUsers.push(user);
  }

   // Insert 100 sample decks
   for (let i = 1; i <= 100; i++) {
    const randomKeywords = faker.helpers.arrayElements(sampleKeywords, {
      min: 1,
      max: 3,
    });
    const title = `Deck #${i} ${randomKeywords.join(" ")}`;
    const randomUser = faker.helpers.arrayElement(sampleUsers);
 
    const deck = await db
      .insert(decks)
      .values({
        title,
        date: faker.date.recent({days: 5}).toISOString(),
        userId: randomUser.id,
      })
      .returning()
      .get();

  
    // Insert 1-20 comments for each post
    const numCards = faker.number.int({ min: 1, max: 20 });
    for (let j = 1; j <= numCards; j++) {
      const front = `Front of card #${j} for Deck #${i}`; // Declare front
      const back = `Back of card #${j} for Deck #${i}`;   // Declare back
      const randomCommenter = faker.helpers.arrayElement(sampleUsers);
      await db.insert(cards).values({
        front,
        back,
        date: faker.date.recent({ days: 3}).toISOString(),
        deckId: deck.id,
        userId: randomCommenter.id,
      });
    }
  }

    
  console.log("Seeding completed successfully.");
}

seed()
  .catch((e) => {
    console.error("Seeding failed:");
    console.error(e);
  })
  .finally(() => {
    connection.close();
  });