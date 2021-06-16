import { ReactElement, ReactNode } from 'react';
import { makeStyles, Paper, Typography } from '@material-ui/core';
import { colors, padding } from '../../theme/theme';
import LinkContainer from './LinkContainer';

const useStyles = makeStyles(() => ({
  content: {
    display: 'grid',
    gridGap: padding.minimal,
  },
}));

interface SideCardProps {
  link?: string;
  linkText?: string;
  title: string;
  children: ReactNode;
  hrefBarColor?: string;
}

const SideCard = ({
  hrefBarColor = colors.primary,
  link,
  linkText,
  title,
  children,
}: SideCardProps): ReactElement => {
  const classes = useStyles();

  return (
    <div>
      {link && linkText && (
        <LinkContainer link={link} linkText={linkText} linkBarColor={hrefBarColor} />
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
