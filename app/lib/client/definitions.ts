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

const isFile = (val: unknown): val is File => val instanceof File;

export const InvoiceFormSchema = z.object({
  senderName: z.string().nullable(),
  invoiceAttachment: z
    .custom<File>(isFile, { message: 'O anexo é obrigatório' })
    .refine((file) => file.size > 0, 'Arquivo vazio'),
});

export type InvoiceFormState = {
  errors?: z.ZodFlattenedError<z.infer<typeof InvoiceFormSchema>>;
  message?: string;
};

export const InvoiceDataSchema = z.object({
  totalPrice: z.string(),
  buyerTaxId: z.string(),
  vendorTaxId: z.string(),
  vendorName: z.string(),
  receiptNumber: z.string(),
  receiptDate: z.string(),
})

export type InvoiceDataType = z.infer<typeof InvoiceDataSchema>

export type InvoiceDataFormState = {
  errors?: z.ZodFlattenedError<z.infer<typeof InvoiceFormSchema>>;
  message?: string;
  invoiceData?: InvoiceDataType
}