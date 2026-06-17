'use client'

import Image from 'next/image'
import { CloudUpload } from '@mui/icons-material'
import { useCallback, useTransition, useState } from 'react'
import { Box, Button, FormGroup, TextField, Typography } from '@mui/material'

import { useAlert } from '@/app/ui/AlertContextProvider'
import { ConfirmInvoiceModal } from '../ConfirmInvoiceModal'
import { analyseInvoice, uploadInvoice } from '@/app/actions/invoice'
import { InvoiceDataType, InvoiceFormState } from '@/app/lib/client/definitions'

import './style.css'

const initialState: InvoiceFormState = {
  message: '',
  errors: {
    fieldErrors: {},
    formErrors: []
  },
}

export function InvoiceComponent() {
  const { showNotification } = useAlert();
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<InvoiceFormState>(initialState);
  const [open, setOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceDataType>({
    buyerTaxId: '',
    receiptDate: '',
    receiptNumber: '',
    totalPrice: '',
    vendorTaxId: '',
    vendorName: '',
  });

  const [formData, setFormData] = useState({
    senderName: '',
    invoiceAttachment: null as File | null,
  })

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState(initialState);

    startTransition(async () => {
      const result = await analyseInvoice(initialState, {
        senderName: formData.senderName,
        invoiceAttachment: formData.invoiceAttachment,
      });
      setState(result);
      if (result?.message) {
        const hasErrors = Object.keys(result.errors?.fieldErrors || {}).length > 0 || Object.keys(result.errors?.formErrors || {}).length > 0;

        if (hasErrors) {
          showNotification(result.message, 'error');
        } else if (!result.invoiceData) {
          showNotification('Algo deu errado, tente novamente mais tarde', 'error');
        } else {
          setInvoiceData(result.invoiceData);
          setOpen(true);
        }
      }
    });
  }, [formData, showNotification]);

  const handleConfirm = useCallback(async () => {
    startTransition(async () => {
      const result = await uploadInvoice(invoiceData, {
        senderName: formData.senderName,
        invoiceAttachment: formData.invoiceAttachment,
      });
      setState(result);
      if (result?.message) {
        const hasErrors = Object.keys(result.errors?.fieldErrors || {}).length > 0 || Object.keys(result.errors?.formErrors || {}).length > 0;

        if (hasErrors) {
          showNotification(result.message, 'error');
        } else {
          setFormData({ senderName: '', invoiceAttachment: null });
          showNotification('Nota fiscal enviada com sucesso', 'success');
          setOpen(false);
        }
      }
    });
  }, [formData, invoiceData, showNotification]);

  return (
    <Box className='invoice-page'>
      <Image src={'/login/background.jpg'} alt='Background' width={1000} height={1000} className='invoice-background-image' />
      <FormGroup className='invoice-box'>
        <Box component='form' onSubmit={handleSubmit} suppressHydrationWarning={true}>
          <Box className='invoice-title-container'>
            <Typography className='bold' variant='h5'>Enviar nota fiscal</Typography>
            <Typography variant='body2' color='textSecondary'>*A nota precisa ter sido emitida com o CNPJ do Bunkyo</Typography>
          </Box>

          <Box className='invoice-fields-container'>
            <TextField
              name='senderName'
              type='text'
              label='Seu nome'
              placeholder='João da Silva'
              value={formData.senderName}
              onChange={e => { setFormData({ ...formData, senderName: e.target.value }) }}
              error={!!state?.errors?.fieldErrors?.senderName}
              helperText={state?.errors?.fieldErrors?.senderName}
            />

            <Button
              component="label"
              role={undefined}
              variant="outlined"
              tabIndex={-1}
              startIcon={<CloudUpload />}
              fullWidth
            >
              <Typography variant='button'>
                {formData.invoiceAttachment ? formData.invoiceAttachment.name : 'Upload'}
              </Typography>
              <input
                name='invoiceAttachment'
                type='file'
                capture='environment'
                hidden
                onChange={e => {
                  const file = e.target.files?.[0] || null;
                  setFormData({
                    ...formData,
                    invoiceAttachment: file,
                  });

                  e.target.files = null;
                  e.target.value = '';
                }}
              ></input>
            </Button>

            <Button
              type='submit'
              variant='contained'
              loading={isPending}
              disabled={
                (formData.invoiceAttachment === null)
                || isPending}
            >
              <Typography variant='button'>Enviar</Typography>
            </Button>
          </Box>
        </Box>
      </FormGroup>
      <ConfirmInvoiceModal
        invoiceData={invoiceData}
        open={open}
        isLoading={isPending}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
      />
    </Box>
  )
}