import { z } from "zod";
import { isValidCountry } from "./countries";

export const loginSchema = z.object({
  email: z.string().email(),
});

export const otpVerifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  fullName: z.string().min(3),
  country: z.string().refine(isValidCountry, "Invalid country"),
});

export const restaurantCreateSchema = z.object({
  name: z.string().min(2),
  location: z.string().min(2),
});

export const categoryCreateSchema = z.object({
  name: z.string().min(2),
  restaurantId: z.string().cuid(),
});

export const dishCreateSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  imageUrl: z.string().url(),
  spiceLevel: z.number().optional(),
  restaurantId: z.string().cuid(),
  categoryIds: z.array(z.string().cuid()),
});
