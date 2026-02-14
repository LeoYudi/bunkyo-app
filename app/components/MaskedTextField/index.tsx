/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import { IMaskInput } from 'react-imask'
import { TextField, TextFieldProps } from '@mui/material'

type IMaskInputProps = React.ComponentProps<typeof IMaskInput>
type MaskedTextFieldProps = TextFieldProps & IMaskInputProps

const TextMaskCustom = React.forwardRef<HTMLInputElement, IMaskInputProps>(
  function TextMaskCustom(props, ref) {
    return <IMaskInput {...props} inputRef={ref} />
  }
)

const TEXT_FIELD_ONLY_PROPS = new Set([
  'helperText',
  'error',
  'label',
  'fullWidth',
  'variant',
  'margin',
  'size',
  'color',
  'FormHelperTextProps',
  'InputLabelProps',
  'InputProps',
  'slotProps',
  'slots',
  'FormControlProps',
])

const IMASK_ONLY_PROPS = new Set([
  'mask',
  'blocks',
  'definitions',
  'unmask',
  'overwrite',
  'radix',
  'thousandsSeparator',
  'scale',
  'signed',
  'normalizeZeros',
  'padFractionalZeros',
  'min',
  'max',
  'lazy',
  'placeholderChar',
  'onAccept',
  'onComplete',
  'inputRef',
])

export function MaskedTextField(props: MaskedTextFieldProps) {
  const defaultInputProps: Record<string, any> = {}
  const imaskProps: Record<string, any> = {}
  const textFieldProps: Record<string, any> = {}

  for (const [key, value] of Object.entries(props)) {
    if (IMASK_ONLY_PROPS.has(key)) {
      imaskProps[key] = value
    } else if (TEXT_FIELD_ONLY_PROPS.has(key)) {
      textFieldProps[key] = value
    } else {
      defaultInputProps[key] = value
    }
  }

  return (
    <TextField
      {...textFieldProps}
      {...defaultInputProps}
      slotProps={{
        input: {
          inputComponent: TextMaskCustom as any,
          inputProps: { ...imaskProps, ...defaultInputProps },
        },
      }}
    />
  )
}
