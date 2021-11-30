import { Box, Paper, SxProps } from '@mui/material';
import { ReactElement, ReactNode } from 'react';
import { borderRadius, colors, padding } from '../../theme/Theme';

interface RowPaperProps {
  children: ReactNode;
  color?: string;
  sx?: SxProps;
}

const RowPaper = ({ children, color = colors.blue, sx = {} }: RowPaperProps): ReactElement => (
  <Box sx={{ display: 'grid', gridTemplateColumns: 'min-content 1fr' }}>
    <Box
      sx={{
        background: color,
        width: '6px',
        borderRadius: `${borderRadius.standard} 0 0 ${borderRadius.standard}`,
      }}
    />
    <Paper sx={{ ...sx, padding: padding.small }}>{children}</Paper>
  </Box>
);

export default RowPaper;
