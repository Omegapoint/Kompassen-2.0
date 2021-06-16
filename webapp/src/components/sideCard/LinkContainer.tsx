import { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import { Link, makeStyles, Paper, Theme } from '@material-ui/core';
import { padding } from '../../theme/theme';
import arrowCircled from '../../assets/arrowCircled.svg';

interface StyleProps {
  linkBarColor?: string;
}

interface SideCardProps {
  link: string;
  linkText: string;
  linkBarColor: string;
}

const useStyles = makeStyles<Theme, StyleProps>(() => ({
  linkContainer: {
    display: 'grid',
    gridAutoFlow: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '320px',
    borderRadius: '5px 5px 0 0',
    padding: `${padding.small} ${padding.standard}`,
    background: ({ linkBarColor }) => linkBarColor,
  },
  arrowIcon: {
    height: '20px',
  },
}));

const LinkContainer = ({ link, linkText, linkBarColor }: SideCardProps): ReactElement => {
  const classes = useStyles({ linkBarColor });
  return (
    <Paper className={classes.linkContainer}>
      <Link component={NavLink} to={link} color="secondary" variant="subtitle1">
        {linkText}
      </Link>
      <Link component={NavLink} to={link} className={classes.arrowIcon}>
        <img alt="arrow circled" src={arrowCircled} width="20px" height="20px" />
      </Link>
    </Paper>
  );
};

export default LinkContainer;
