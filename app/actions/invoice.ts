import z from 'zod';
import dayjs from 'dayjs';

import { LocalAPI } from '../lib/client/api';
import { InvoiceDataFormState, InvoiceDataType, InvoiceFormSchema, InvoiceFormState } from '../lib/client/definitions';

export async function uploadInvoice(
  invoiceData: InvoiceDataType,
  formData: unknown,
): Promise<InvoiceFormState> {
  const validateFields = InvoiceFormSchema.safeParse(formData);

  if (!validateFields.success) {
    return { errors: z.flattenError(validateFields.error) };
  }

  const file = validateFields.data.invoiceAttachment;
  const name = validateFields.data.senderName;
  
  const receiptDate = dayjs(invoiceData.receiptDate);
  const validDate = receiptDate.isValid() ? receiptDate : dayjs();
  const day = validDate.format('YYYYMMDD');

  const response = await LocalAPI.post({
    path: '/api/invoice/upload',
    body: JSON.stringify({
      fileData: Buffer.from(await file.arrayBuffer()).toString('base64'),
      fileName: `${day} - ${name} - R$ ${invoiceData.totalPrice}`,
      fileType: file.type,
      invoiceData,
    }),
  });

  if (response.error) {
    return { message: response.error, errors: { fieldErrors: {}, formErrors: [response.error] } };
  }

  return {
    message: 'Nota fiscal enviada com sucesso',
    errors: { fieldErrors: {}, formErrors: [] },
  };
}

export async function analyseInvoice(
  state: InvoiceFormState,
  formData: unknown,
): Promise<InvoiceDataFormState> {
  const validateFields = InvoiceFormSchema.safeParse(formData);

  if (!validateFields.success) {
    return { errors: z.flattenError(validateFields.error) };
  }

  const file = validateFields.data.invoiceAttachment;

  const response = await LocalAPI.post({
    path: '/api/invoice/analysis',
    body: JSON.stringify({
      base64: Buffer.from(await file.arrayBuffer()).toString('base64'),
      mimeType: file.type,
    }),
  });

  if (response.error) {
    return { message: response.error, errors: { fieldErrors: {}, formErrors: [response.error] } };
  }

  return {
    ...state,
    message: 'Nota fiscal enviada com sucesso',
    errors: { fieldErrors: {}, formErrors: [] },
    invoiceData: response.data,
  }
}
