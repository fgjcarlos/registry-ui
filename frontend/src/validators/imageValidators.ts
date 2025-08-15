import { z } from 'zod';

export const PaginatedImagesResponseSchema = z.object({
  images: z.array(
    z.object({
      name: z.string(),
      tags: z.array(z.string()),
    })
  ),
  // nextPage may be a number, null (explicitly no next page) or omitted by the API
  nextPage: z.number().nullable().optional(),
});

