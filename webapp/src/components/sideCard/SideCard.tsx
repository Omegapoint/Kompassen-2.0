import { Paper, Typography } from '@mui/material';
import { ReactElement, ReactNode } from 'react';
import { colors, padding } from '../../theme/Theme';
import HrefContainer from './HrefContainer';

interface SideCardProps {
  href?: string;
  hrefText?: string;
  title?: string;
  children?: ReactNode;
  hrefBarColor?: string;
}

const SideCard = ({
  hrefBarColor = colors.primary,
  href,
  hrefText,
  title,
  children,
}: SideCardProps): ReactElement => (
  <div>
    {href && hrefText && (
      <HrefContainer href={href} hrefText={hrefText} hrefBarColor={hrefBarColor} />
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
