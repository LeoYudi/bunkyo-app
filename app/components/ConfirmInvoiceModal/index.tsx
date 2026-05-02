import { Close } from '@mui/icons-material';
import { Button, Divider, Grid, IconButton, Modal, Paper, Stack, Typography } from '@mui/material';

import { InvoiceDataType } from '@/app/lib/client/definitions';

import './style.css';

type ConfirmInvoiceModalProps = {
    invoiceData: InvoiceDataType;
    open: boolean;
    isLoading: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function ConfirmInvoiceModal({
    invoiceData,
    open,
    isLoading,
    onClose,
    onConfirm,
}: ConfirmInvoiceModalProps) {
    return (
        <Modal open={open} onClose={onClose}>
            <Paper elevation={6} className='confirm-invoice-modal'>
                <Stack direction='column'>
                    <Stack direction='row' justifyContent='space-between' alignItems='center' padding={2}>
                        <Typography className='bold' variant='h6'>Confirmar nota</Typography>

                        <IconButton color='primary' onClick={onClose}>
                            <Close />
                        </IconButton>
                    </Stack>

                    <Divider />

                    <Stack direction='column' padding={2}>
                        <Grid alignItems='center' container spacing={2} padding={1}>
                            <Grid size={4}>
                                <Typography color='secondary'>CNPJ do fornecedor</Typography>
                            </Grid>
                            <Grid size={8}>
                                <Typography>{invoiceData.vendorTaxId}</Typography>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Grid alignItems='center' container spacing={2} padding={1}>
                            <Grid size={4}>
                                <Typography color='secondary'>Nome do fornecedor</Typography>
                            </Grid>
                            <Grid size={8}>
                                <Typography>{invoiceData.vendorName}</Typography>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Grid alignItems='center' container spacing={2} padding={1}>
                            <Grid size={4}>
                                <Typography color='secondary'>Data de emissão</Typography>
                            </Grid>
                            <Grid size={8}>
                                <Typography>{invoiceData.receiptDate}</Typography>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Grid alignItems='center' container spacing={2} padding={1}>
                            <Grid size={4}>
                                <Typography color='secondary'>Número da nota</Typography>
                            </Grid>
                            <Grid size={8}>
                                <Typography>{invoiceData.receiptNumber}</Typography>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Grid alignItems='center' container spacing={2} padding={1}>
                            <Grid size={4}>
                                <Typography color='secondary'>CNPJ/CPF do comprador</Typography>
                            </Grid>
                            <Grid size={8}>
                                <Typography>{invoiceData.buyerTaxId}</Typography>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Grid alignItems='center' container spacing={2} padding={1}>
                            <Grid size={4}>
                                <Typography color='secondary'>Valor total</Typography>
                            </Grid>
                            <Grid size={8}>
                                <Typography>R$ {invoiceData.totalPrice}</Typography>
                            </Grid>
                        </Grid>
                    </Stack>

                    <Divider />

                    <Stack direction='row' spacing={2} justifyContent='space-between' padding={2}>
                        <Button variant='outlined' onClick={onClose} disabled={isLoading}>Cancelar</Button>
                        <Button variant='contained' onClick={onConfirm} disabled={isLoading} loading={isLoading}>Confirmar</Button>
                    </Stack>
                </Stack>
            </Paper>
        </Modal>
    )
}