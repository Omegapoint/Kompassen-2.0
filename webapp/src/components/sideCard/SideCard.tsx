import { Paper, Typography } from '@mui/material';
import { ReactElement, ReactNode } from 'react';
import { colors, padding } from '../../theme/Theme';
import SideCardHeader from './SideCardHeader';

interface SideCardProps {
  headerText?: string;
  title?: string;
  children?: ReactNode;
  bgColor?: string;
}

const SideCard = ({
  bgColor = colors.primary,
  headerText,
  title,
  children,
}: SideCardProps): ReactElement => (
  <div>
    {headerText && (
      <SideCardHeader headerText={headerText} bgColor={bgColor} />
    )}
    {title && (
      <Paper
        sx={{
          display: 'grid',
          gridGap: padding.minimal,
          padding: padding.small,
          '& h6': {
            lineHeight: 1,
          },
        }}
      >
        <Typography variant="h6" color="primary">
          {title}
        </Typography>
        {children}
      </Paper>
    )}
  </div>
);

export default SideCard;
