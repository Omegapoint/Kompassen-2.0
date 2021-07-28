import { Link, makeStyles, Paper, Theme } from '@material-ui/core';
import { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import longArrowCircled from '../../assets/longArrowCircled.svg';
import { borderRadius, padding } from '../../theme/Theme';

interface StyleProps {
  hrefBarColor: string;
}

interface LinkContainerProps {
  href: string;
  hrefText: string;
  hrefBarColor: string;
}

const useStyles = makeStyles<Theme, StyleProps>(() => ({
  linkContainer: {
    display: 'grid',
    gridAutoFlow: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: `${borderRadius.small} ${borderRadius.small} 0 0`,
    padding: `${padding.small} ${padding.small}`,
    background: ({ hrefBarColor }) => hrefBarColor,
  },
  arrowIcon: {
    height: '20px',
  },
}));

const HrefContainer = ({ href, hrefText, hrefBarColor }: LinkContainerProps): ReactElement => {
  const classes = useStyles({ hrefBarColor });
  return (
    <Paper className={classes.linkContainer}>
      <Link component={NavLink} to={href} color="secondary" variant="subtitle1">
        {hrefText}
      </Link>
      <Link component={NavLink} to={href} className={classes.arrowIcon}>
        <img alt="arrow circled" src={longArrowCircled} width="20px" height="20px" />
      </Link>
    </Paper>
  );
};

export default HrefContainer;
