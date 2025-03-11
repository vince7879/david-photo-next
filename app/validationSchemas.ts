import { z } from 'zod';

export const createPhotoSchema = z.object({
    place: z.string().min(1).max(191),
    month: z.string().min(1).max(191),
    year: z.string().min(1).max(191),
    color: z.string().min(1).max(191)
});
