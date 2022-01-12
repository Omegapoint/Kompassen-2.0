import React, { ReactElement } from 'react';
import { Box, Paper, Typography } from "@mui/material";
import { padding } from "../../theme/Theme";

interface EventRegistrationNoteProps {
  title: string;
  message?: string;
}

const EventRegistrationNote = ({title, message}: EventRegistrationNoteProps): ReactElement => {
  return (
    <Box sx={{display: 'grid', justifyItems: 'center'}}>
      <Paper
        sx={{
          display: 'grid',
          justifyContent: 'center',
          gridGap: padding.minimal,
          padding: padding.medium,
          '& h6': {
            lineHeight: 1,
          },
        }}
      >
        <Typography variant="h4" align="center">{title}</Typography>
        {!!message && (
          <Typography variant="body1" align="center">{message}</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default EventRegistrationNote
