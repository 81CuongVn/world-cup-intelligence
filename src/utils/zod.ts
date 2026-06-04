import { z } from 'zod';

export const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export const searchQuerySchema = z.object({
  q: z.string().min(1).max(200),
});
