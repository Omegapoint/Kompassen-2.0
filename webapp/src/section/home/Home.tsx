import { Button, makeStyles, Typography } from '@material-ui/core';
import React, { ReactElement, useState } from 'react';
import SideCard from '../../components/sideCard/SideCard';
import { colors, padding } from '../../theme/Theme';
import PublishIdea from '../../components/publishIdea/PublishIdea';

const useStyles = makeStyles(() => ({
  container: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr max-content',
    gridTemplateRows: 'max-content auto auto auto auto',
    gridGap: `${padding.medium} ${padding.large}`,
    padding: '0 20px',
    '& > :nth-child(1)': {
      gridColumn: '1 / 3',
    },
  },
  leftPanel: {
    display: 'grid',
    gridGap: padding.standard,
    alignContent: 'start',
  },
  rightPanel: {
    display: 'grid',
    width: '320px',
    gridGap: padding.standard,
    alignContent: 'start',
  },
  button: {
    fontSize: '0.95rem',
    padding: padding.minimal,
  },
}));

const Home = (): ReactElement => {
  const [active, setActive] = useState(false);
  const classes = useStyles();

  const activateIdea = () => {
    setActive((e) => !e);
  };
  return (
    <div className={classes.container}>
      <Typography variant="h1">Idéer till kompetensdagar</Typography>
      <div className={classes.leftPanel}>
        {active && <PublishIdea cancel={() => setActive(false)} />}
        {!active && (
          <Button
            onClick={activateIdea}
            className={classes.button}
            variant="contained"
            color="primary"
          >
            Publicera ny idé
          </Button>
        )}
      </div>
      <div className={classes.rightPanel}>
        <SideCard
          title="Nästa kompetensdag"
          hrefText="Anmäl pass till kompetensdagar"
          hrefBarColor={colors.orange}
          href="/"
        >
          <p>missing content</p>
        </SideCard>
        <SideCard title="Mina senaste pass" hrefText="Hantera mina anmälda pass " href="/">
          <p>missing content</p>
        </SideCard>
        <SideCard title="Trendar just nu">
          <p>missing content</p>
        </SideCard>
        <SideCard title="Funderar på att hålla i ett pass?">
          <p>missing content</p>
        </SideCard>
        <SideCard title="Snabbguide för KomPass 2.0">
          <p>missing content</p>
        </SideCard>
        <SideCard title="Nuvarande planerare">
          <p>missing content</p>
        </SideCard>
      </div>
    </div>
  );
};

export default Home;
