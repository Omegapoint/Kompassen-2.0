import React, { ReactElement } from 'react';
import { createStyles, IconButton, makeStyles, Typography } from '@material-ui/core';
import { ChatBubble, FavoriteBorder } from '@material-ui/icons';
import { colors, padding } from '../../theme/Theme';
import Expander, { ExpanderProps } from './Expander';

const useStyles = makeStyles(() =>
  createStyles({
    topContainer: {
      display: 'grid',
      gridTemplateColumns: '1fr max-content min-content',
      gridTemplateAreas: `"infoBar icons icons"
                          "header header header"
                          "content content content"
                          "tags registerButton registerButton"
                          "expandButtonContainer expandButtonContainer expandButtonContainer"`,
      padding: padding.small,
      gridGap: `${padding.minimal} 0`,
      position: 'relative',
    },
    infoBar: {
      color: colors.grey,
      fontWeight: 300,
      fontSize: '1rem',
      gridArea: 'infoBar',
    },
    icons: {
      display: 'grid',
      gridArea: 'icons',
      gridAutoFlow: 'column',
      gridGap: padding.minimal,
      justifyContent: 'end',
    },
    icon: {
      width: '20px',
      height: '20px',
    },
    iconContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    header: {
      gridArea: 'header',
    },
    content: {
      gridArea: 'content',
    },
    tags: {
      display: 'flex',
      gridGap: padding.small,
      gridArea: 'tags',
    },
  })
);

const formatInfoBar = (location: string, annotation?: string) => [location, annotation].join(' • ');

const formatTags = (tags: string[]) =>
  tags.map((e) => (
    <Typography key={e} variant="subtitle2">
      #{e}
    </Typography>
  ));

const infoBarText = formatInfoBar('Stockholm', 'Söker passhållare');
const tags = formatTags(['Stockholm', 'Banan', 'Frukt', 'bdsa']);

const TopContainer = ({ isExpanded, bookedBy, expand }: ExpanderProps): ReactElement => {
  const classes = useStyles({ isExpanded });
  return (
    <div className={classes.topContainer}>
      <Typography className={classes.infoBar} variant="subtitle1">
        {infoBarText}
      </Typography>
      <div className={classes.icons}>
        <div className={classes.iconContainer}>
          <IconButton className={classes.icon}>
            <ChatBubble className={classes.icon} color="primary" />
          </IconButton>
          <Typography color="primary">4</Typography>
        </div>
        <div className={classes.iconContainer}>
          <IconButton className={classes.icon}>
            <FavoriteBorder className={classes.icon} color="primary" />
          </IconButton>
          <Typography color="primary">4</Typography>
        </div>
      </div>

      <Typography className={classes.header} variant="h6">
        Nya funktioner i Azure 2021 Workshop Pecha Kucha
      </Typography>

      <Typography className={classes.content}>
        Nam quis nulla. Integer malesuada. In in enim a arcu imperdiet malesuada. Sed vel lectus.
        Donec odio urna, tempus molestie, porttitor ut, iaculis quis, sem. Phasellus rhoncus. Aenean
        id metus id velit ullamcorper pulvinar. Vestibulum fermentum tortor
      </Typography>
      <div className={classes.tags}>{tags}</div>
      <Expander isExpanded={isExpanded} bookedBy={bookedBy} expand={expand} />
    </div>
  );
};
export default TopContainer;
