import { Box, Button, IconButton, Typography } from '@mui/material';
import { ReactElement, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { ReactComponent as ShortArrowCircled } from '../../assets/shortArrowCircled.svg';
import { padding } from '../../theme/Theme';
import LectureContext from './LectureContext';

export interface ExpanderProps {
  isExpanded: boolean;
  expand: () => void;
}

const Expander = ({ isExpanded, expand }: ExpanderProps): ReactElement => {
  const { lecture } = useContext(LectureContext);
  return (
    <>
      {lecture.lecturer ? (
        <Box sx={{ gridArea: 'registerButton', maxWidth: '190px' }}>
          <Typography variant="body2" sx={{ justifySelf: 'flex-end' }}>
            {`${lecture.lecturer} har ställt upp som passhållare`}
          </Typography>
        </Box>
      ) : (
        <Button
          component={NavLink}
          to={`/lecture/edit/${lecture.id}`}
          sx={{ gridArea: 'registerButton', maxWidth: '190px' }}
          variant="contained"
          color="primary"
        >
          Ta passet
        </Button>
      )}

      <Box
        sx={{
          gridArea: 'expandButtonContainer',
          position: 'absolute',
          bottom: `calc(-12px - 13px - ${padding.small})`,
          width: '100%',
          display: 'grid',
          justifyItems: 'center',
        }}
      >
        <IconButton
          sx={{
            '& svg': { width: '26px', height: '26px' },
            transform: `rotate(${isExpanded ? 180 : 0}deg)`,
          }}
          onClick={expand}
          size="large"
        >
          <ShortArrowCircled />
        </IconButton>
      </Box>
    </>
  );
};

export default Expander;
