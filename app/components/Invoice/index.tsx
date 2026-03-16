'use client'

import Image from 'next/image'
import { Dayjs } from 'dayjs'
import { CloudUpload } from '@mui/icons-material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { useCallback, useTransition, useState } from 'react' // Added useCallback and useTransition
import { Box, Button, FormGroup, TextField, Typography } from '@mui/material'

import { useAlert } from '@/app/ui/AlertContextProvider'
import { uploadInvoice } from '@/app/actions/invoice'
import { MaskedTextField } from '../MaskedTextField'
import { InvoiceFormState, InvoiceFormType } from '@/app/lib/client/definitions'

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

  const [formData, setFormData] = useState<InvoiceFormType>({
    senderName: '',
    invoiceValue: '',
    invoiceDate: null as Dayjs | null,
    invoiceAttachment: null as File | null
  })

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState(initialState);

    startTransition(async () => {
      const result = await uploadInvoice(initialState, formData);
      setState(result);
      console.log(result)
      if (result?.message) {
        const hasErrors = Object.keys(result.errors?.fieldErrors || {}).length > 0;

        if (hasErrors) {
          showNotification(result.message, 'error');
        } else {
          showNotification(result.message, 'success');
          setFormData({
            senderName: '',
            invoiceValue: '',
            invoiceDate: null,
            invoiceAttachment: null
          });
        }
      }
    });
  }, [formData, showNotification]);
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

            <MaskedTextField
              name='invoiceValue'
              type='text'
              label='Valor da nota'
              placeholder='R$ 0,00'
              mask={'R$ num'}
              blocks={{
                num: {
                  mask: Number,
                  thousandsSeparator: '.',
                  scale: 2,
                  normalizeZeros: true,
                  padFractionalZeros: true,
                  radix: ',',
                }
              }}
              unmask="typed"
              value={formData.invoiceValue}
              onAccept={(value: number | string) => {
                setFormData({
                  ...formData,
                  invoiceValue: value === '' ? '' : `${Number(value)}`,
                })
              }}
              error={!!state?.errors?.fieldErrors?.invoiceValue}
              helperText={state?.errors?.fieldErrors?.invoiceValue}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                name='invoiceDate'
                label='Data da compra'
                format='DD/MM/YYYY'
                value={formData.invoiceDate}
                onChange={(value) => { setFormData({ ...formData, invoiceDate: value }) }}
                slotProps={{
                  textField: {
                    error: !!state?.errors?.fieldErrors?.invoiceDate,
                    helperText: state?.errors?.fieldErrors?.invoiceDate
                  }
                }}
              />
            </LocalizationProvider>

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
    </Box >
  )
}