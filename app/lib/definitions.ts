import * as z from 'zod';

export const LoginFormSchema = z.object({
  username: z.string().trim(),
  password: z.string().trim(),
});

export type FormState = {
  errors?: z.ZodFlattenedError<z.infer<typeof LoginFormSchema>>;
  message?: string;
};
