import { Button, Link, makeStyles, Typography } from '@material-ui/core';
import { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import { colors, padding } from '../../theme/Theme';

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr max-content',
    gridTemplateAreas: `"text text"
                       ". button"`,
    gridGap: `${padding.small}`,
  },
  text: {
    gridArea: 'text',
  },
  link: {
    color: colors.black,
    textDecoration: 'underline',
  },
  button: {
    gridArea: 'button',
  },
}));

const Interested = (): ReactElement => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography className={classes.text}>
        {`Kolla in vår guide för att hålla i ett pass, eller fråga `}
        <Link className={classes.link} component={NavLink} to="/" variant="body1">
          en av de nuvarande planerarna.
        </Link>
      </Typography>
      <Button className={classes.button} color="primary" variant="contained">
        Till passguiden
      </Button>
    </div>
  );
};

export default Interested;
