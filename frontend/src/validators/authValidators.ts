import { z } from 'zod';

// Define Zod schemas for validation
export const TagsResponseSchema = z.object({
  tags: z.array(z.string()).optional(),
});

export const RegistryInfoSchema = z.object({
  images: z.array(
    z.object({
      name: z.string(),
      tags: z.array(z.string()),
    })
  ),
  totalImages: z.number(),
  registryUrl: z.string(),
});

// Define Zod schemas for validation
export const SaveSessionResponseSchema = z.union([
  z.object({
    success: z.boolean(),
    error: z.string().optional(),
    user: z
      .object({
        username: z.string(),
        registryUrl: z.string(),
      })
      .optional(),
  }),
  z.object({
    error: z.string(),
  }),
]);

export const GetSessionResponseSchema = z.object({
  authenticated: z.boolean(),
  user: z
    .object({
      username: z.string(),
      registryUrl: z.string(),
    })
    .optional(),
});

export const LoginResponseSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
});

