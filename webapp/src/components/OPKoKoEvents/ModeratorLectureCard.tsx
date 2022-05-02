import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { likeLecture, unlikeLecture } from '../../api/Api';
import { getAzureUser } from '../../api/GraphApi';
import { useAppSelector } from '../../lib/Lib';
import { Category, Lecture } from '../../lib/Types';
import { borderRadius, colors, padding } from '../../theme/Theme';

export const cellHeight = 150;

interface ModeratorLectureCardProps {
  lecture: Lecture;
}

const ModeratorLectureCard = ({ lecture }: ModeratorLectureCardProps): ReactElement => {
  const categories = useAppSelector((state) => state.categories);
  const category = categories.find(
    (e: { id: string | null }) => e.id === lecture.categoryID
  ) as Category;
  const { azureUser } = useAppSelector((state) => state.session);
  const [open, setOpen] = useState(false);
  const likes = lecture.likes?.length || 0;
  const likeMutation = useMutation(likeLecture);
  const unlikeMutation = useMutation(unlikeLecture);
  const like = () => likeMutation.mutate({ id: lecture.id });
  const unlike = () => unlikeMutation.mutate({ id: lecture.id });

  const [lecturers, setLecturers] = useState(['']);
  useEffect(() => {
    const lecturersName: string[] = [];

    async function fetchMyAPI(userID: string) {
      return getAzureUser(userID).then((azureU) => azureU.displayName);
    }

    if (lecture.lecturers) {
      lecture.lecturers.map((lecturer) =>
        fetchMyAPI(lecturer.userID).then((value) => lecturersName.push(value))
      );
      setLecturers(lecturersName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Box sx={{ background: `${colors.white}dd`, borderRadius: borderRadius.small }}>
        <Box
          sx={{
            display: 'grid',
            // gridTemplateColumns: opkoko ? 'max-content' : '1fr max-content',
            // gridTemplateRows: opkoko ? 'max-content' : 'max-content 1fr max-content',
            border: `${category.color} 1px solid`,
            background: `${category.color}20`,
            borderRadius: borderRadius.small,
            padding: padding.minimal,
            width: '100%',
            height: '100%',
          }}
        >
          <Box sx={{ display: 'column', gridGap: padding.minimal }}>
            <Box
              sx={{
                display: 'column',
                gridGap: padding.minimal,
                gridTemplateColumns: 'max-content 1fr',
              }}
            >
              <Typography variant="h6">{lecture.title} </Typography>
              <Typography>
                {lecturers[0] !== '' ? lecturers.join(', ') : lecture.lecturer}
              </Typography>
              <Box sx={{ display: 'column', width: '100%' }}>
                <Button
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  Se mer info
                </Button>
                <Button
                  onClick={lecture.likes?.includes(azureUser.id) ? unlike : like}
                  variant="contained"
                >
                  <Typography>Anmäl intresse</Typography>
                </Button>

                <Typography color="primary">{likes} intresserade</Typography>
              </Box>
            </Box>
          </Box>

          <>
            <Dialog open={open} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">{lecture.title}</DialogTitle>
              <DialogContent sx={{ display: 'grid', minWidth: '400px', gridGap: padding.small }}>
                <Typography>
                  Talare: {lecturers[0] !== '' ? lecturers.join(', ') : lecture.lecturer}
                </Typography>
                <Typography>{lecture.description}</Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    setOpen(false);
                  }}
                  color="primary"
                >
                  Stäng
                </Button>
              </DialogActions>
            </Dialog>
          </>
        </Box>
      </Box>
    </>
  );
};

export default ModeratorLectureCard;
