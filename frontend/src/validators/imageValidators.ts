import { z } from 'zod';

export const PaginatedImagesResponseSchema = z.object({
  images: z.array(
    z.object({
      name: z.string(),
      tags: z.array(z.string()),
    })
  ),
  nextPage: z.number().nullable(),
});

