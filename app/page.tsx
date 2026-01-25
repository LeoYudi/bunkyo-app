'use client'

import { useActionState, useState } from 'react';
import { Lock, Person, Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, FormGroup, FormLabel, IconButton, InputAdornment, TextField, Typography } from '@mui/material';

import { login } from '@/app/actions/login';
import { FormState } from '@/app/lib/definitions';

import './style.css'
import Image from 'next/image';

const initialState: FormState = {
  message: '',
  errors: {
    fieldErrors: {},
    formErrors: []
  },
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [state, action] = useActionState(login, initialState)

  return (
    <Box className='login-page'>
      <Image src={'/login/background.jpg'} alt='Background' width={1000} height={1000} className='login-background-image' />
      <Box component='form' action={action}>
        <FormGroup className='login-box'>
          <Box className='login-title-container'>
            <Image src={'/login/logo.png'} alt='Logo' width={130} height={130} />
            <Typography className='bold' variant='h5'>Sign in</Typography>
            <Typography variant='body2' color='textSecondary' align='center'>Se não tiver o usuário ou a senha, <br /> entrar em contato com a diretoria.</Typography>
          </Box>
          <TextField
            name='username'
            type='text'
            label='Usuário'
            placeholder='admin'
            error={!!state?.errors?.fieldErrors?.username}
            helperText={state?.errors?.fieldErrors?.username?.[0]}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <Person />
                  </InputAdornment>
                )
              }
            }}
          ></TextField>
          <TextField
            name='password'
            type={showPassword ? 'text' : 'password'}
            label='Senha'
            placeholder='admin123'
            error={!!state?.errors?.fieldErrors?.password}
            helperText={state?.errors?.fieldErrors?.password?.[0]}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword ? 'hide the password' : 'display the password'
                      }
                      onClick={() => { setShowPassword(!showPassword) }}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }
            }}
          ></TextField>

          {state?.errors?.formErrors?.[0] && (
            <FormLabel error>{state.errors.formErrors[0]}</FormLabel>
          )}

          <Button type='submit' variant='contained'>
            <Typography variant='button'>Enviar</Typography>
          </Button>
        </FormGroup>
      </Box>
    </Box>
  )
}