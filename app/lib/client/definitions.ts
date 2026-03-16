import * as z from 'zod';
import dayjs, { Dayjs } from 'dayjs';

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

const isDayjs = (val: unknown): val is Dayjs => dayjs.isDayjs(val);
const isFile = (val: unknown): val is File => val instanceof File;

export const InvoiceFormSchema = z.object({
  senderName: z.string().nullable(),
  invoiceValue: z.string().nullable(),
  invoiceDate: z
    .custom<Dayjs>(isDayjs, { message: 'Data inválida' })
    .refine((d) => d.isValid(), 'Data inválida')
    .nullable(),

  invoiceAttachment: z
    .custom<File>(isFile, { message: 'O anexo é obrigatório' })
    .refine((file) => file.size > 0, 'Arquivo vazio'),
});

export type InvoiceFormState = {
  errors?: z.ZodFlattenedError<z.infer<typeof InvoiceFormSchema>>;
  message?: string;
};
