import QRCodeReact from 'qrcode.react'
import { Skeleton } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { ReactElement } from 'react'
import { brand } from '@safe-global/brand'

const QR_LOGO_SIZE = 20

const QRCode = ({ value, size }: { value?: string; size: number }): ReactElement => {
  const { palette } = useTheme()

  return value ? (
    <QRCodeReact
      value={value}
      size={size}
      bgColor={palette.background.paper}
      fgColor={palette.text.primary}
      imageSettings={{
        src: brand.logoUrl,
        width: QR_LOGO_SIZE,
        height: QR_LOGO_SIZE,
        excavate: true,
      }}
    />
  ) : (
    <Skeleton variant="rectangular" width={size} height={size} />
  )
}

export default QRCode
