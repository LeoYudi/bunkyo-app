import * as z from 'zod';

export const LoginFormSchema = z.object({
  username: z.string().nonempty('Obrigatório'),
  password: z.string().nonempty('Obrigatório'),
});

export type LoginFormState = {
  errors?: z.ZodFlattenedError<z.infer<typeof LoginFormSchema>>;
  message?: string;
};

export type SessionPayload = {
  username: string;
  expiresAt: Date;
};

export const InvoiceFormSchema = z.object({
  senderName: z.string().nonempty('Obrigatório'),
  invoiceValue: z.string().nonempty('Obrigatório'),
  invoiceDate: z.string().nonempty('Obrigatório'),
  invoiceAttachment: z.any(),
})

export type InvoiceFormState = {
  errors?: z.ZodFlattenedError<z.infer<typeof InvoiceFormSchema>>;
  message?: string;
}