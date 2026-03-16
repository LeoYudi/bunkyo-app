import z from 'zod';

import { LocalAPI } from '../lib/client/api';
import {
  InvoiceFormSchema,
  InvoiceFormState,
  InvoiceFormType,
} from '../lib/client/definitions';

export async function uploadInvoice(
  state: InvoiceFormState,
  formData: InvoiceFormType,
): Promise<InvoiceFormState> {
  const validateFields = InvoiceFormSchema.safeParse({
    senderName: formData.senderName,
    invoiceValue: formData.invoiceValue,
    invoiceDate: formData.invoiceDate,
    invoiceAttachment: formData.invoiceAttachment,
  });

  if (!validateFields.success) {
    return { errors: z.flattenError(validateFields.error) };
  }

  const file = validateFields.data.invoiceAttachment;

  const response = await LocalAPI.post({
    path: '/api/upload-to-drive',
    body: JSON.stringify({
      fileData: Buffer.from(await file.arrayBuffer()).toString('base64'),
      fileName: file.name,
      fileType: file.type,
    }),
  });

  if (response.error) {
    return { errors: { fieldErrors: {}, formErrors: [response.error] } };
  }

  return {
    ...state,
    message: 'Nota fiscal enviada com sucesso',
    errors: { fieldErrors: {}, formErrors: [] },
  };
}
