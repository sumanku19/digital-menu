import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  console.log("🌱 Seeding database...");

  const user = await prisma.user.create({
    data: {
      email: "admin@example.com",
      fullName: "Demo Admin",
      country: "United States",
    },
  });

  const restaurant = await prisma.restaurant.create({
    data: {
      name: "Demo Restaurant",
      location: "New York",
      slug: "demo-restaurant",
      ownerId: user.id,
    },
  });

  const starters = await prisma.category.create({
    data: {
      name: "Starters",
      restaurantId: restaurant.id,
    },
  });

  const dish = await prisma.dish.create({
    data: {
      name: "Tomato Soup",
      description: "Delicious homemade tomato soup.",
      imageUrl: "https://via.placeholder.com/300",
      restaurantId: restaurant.id,
    },
  });

  await prisma.dishCategory.create({
    data: {
      categoryId: starters.id,
      dishId: dish.id,
    },
  });

  console.log("✅ Database seeded successfully.");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
