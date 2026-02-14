import z from 'zod';

import { InvoiceFormSchema, InvoiceFormState } from '../lib/client/definitions';

export async function uploadInvoice(state: InvoiceFormState, formData: FormData): Promise<InvoiceFormState> {

  const validateFields = InvoiceFormSchema.safeParse({
    senderName: formData.get('senderName'),
    invoiceValue: formData.get('invoiceValue'),
    invoiceDate: formData.get('invoiceDate'),
    invoiceAttachment: formData.get('invoiceAttachment'),
  })

  if (!validateFields.success) {
    return { errors: z.flattenError(validateFields.error) };
  }

  console.log(validateFields.data)

  return {}
}