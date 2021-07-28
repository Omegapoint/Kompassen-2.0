import { makeStyles, Paper, Typography } from '@material-ui/core';
import { ReactElement, ReactNode } from 'react';
import { colors, padding } from '../../theme/Theme';
import HrefContainer from './HrefContainer';

const useStyles = makeStyles(() => ({
  content: {
    display: 'grid',
    gridGap: padding.minimal,
    padding: padding.small,
    '& h6': {
      lineHeight: 1,
    },
  },
}));

interface SideCardProps {
  href?: string;
  hrefText?: string;
  title: string;
  children: ReactNode;
  hrefBarColor?: string;
}

const SideCard = ({
  hrefBarColor = colors.primary,
  href,
  hrefText,
  title,
  children,
}: SideCardProps): ReactElement => {
  const classes = useStyles();

  return (
    <div>
      {href && hrefText && (
        <HrefContainer href={href} hrefText={hrefText} hrefBarColor={hrefBarColor} />
      )}
      <Paper className={classes.content}>
        <Typography variant="h6" color="primary">
          {title}
        </Typography>
        {children}
      </Paper>
    </div>
  );
};

export default SideCard;
