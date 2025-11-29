import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  // Create a Dish instead of Post. If no Restaurant exists, create a seed User and Restaurant.
  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx || !ctx.db) {
        console.error('tRPC context or db is not available in create');
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database client not available' });
      }

      // Find an existing restaurant to attach the Dish to
      let restaurant = await ctx.db.restaurant.findFirst();

      if (!restaurant) {
        // create a seed user
        const user = await ctx.db.user.create({
          data: {
            email: "seed@local",
            fullName: "Seed User",
            country: "US",
          },
        });

        // create a seed restaurant
        restaurant = await ctx.db.restaurant.create({
          data: {
            name: "Seed Restaurant",
            location: "Local",
            ownerId: user.id,
            slug: "seed-restaurant",
          },
        });
      }

      return ctx.db.dish.create({
        data: {
          name: input.name,
          description: "",
          imageUrl: "",
          restaurantId: restaurant.id,
        },
      });
    }),

  // Return the most recently created Dish
  getLatest: publicProcedure.query(async ({ ctx }) => {
    if (!ctx || !ctx.db) {
      console.error('tRPC context or db is not available in getLatest');
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database client not available' });
    }

    const dish = await ctx.db.dish.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return dish ?? null;
  }),
});
