import { ReactElement, useCallback, useContext, useEffect, useState } from 'react';
import { createStyles, Divider, makeStyles, Paper } from '@material-ui/core';
import { Socket } from 'socket.io-client';
import useBoolean from '../../hooks/UseBoolean';
import BottomContainer from './BottomContainer';
import TopContainer from './TopContainer';
import { borderRadius, colors } from '../../theme/Theme';
import LectureContext from './LectureContext';
import { formatDates } from '../../lib/Lib';
import AppContext from '../../UserContext';
import { Lecture as LectureTP, LectureMessage } from '../../lib/Types';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'grid',
      gridTemplateColumns: 'min-content 1fr',
      gridAutoFlow: 'column',
    },
    line: {
      background: colors.blue,
      width: '6px',
      borderRadius: `${borderRadius.standard} 0 0 ${borderRadius.standard}`,
    },
  })
);

interface LectureProps {
  lecture: LectureTP;
}

const useLectureWS = (socket: Socket, lectureID: string) => {
  const [chat, setChat] = useState<LectureMessage[]>([]);

  useEffect(() => {
    socket.on(`lectureChat/${lectureID}/initial`, (messages) => {
      setChat(formatDates(messages));
    });
    socket.on(`lectureChat/${lectureID}/message`, (message) => {
      setChat((m) => [...m, formatDates(message)]);
    });
    socket.emit('lectureChat/join', lectureID);

    return () => {
      socket.emit('lectureChat/leave', lectureID);
    };
  }, [lectureID, socket]);

  const sendWSMessage = useCallback(
    (message: string) => socket.emit('lectureChat/message', lectureID, message),
    [lectureID, socket]
  );

  return { chat, sendWSMessage };
};

const Lecture = ({ lecture }: LectureProps): ReactElement => {
  const { socket } = useContext(AppContext);
  const [isExpanded, expand] = useBoolean();
  const classes = useStyles({ isExpanded });
  const { chat, sendWSMessage } = useLectureWS(socket, lecture.id);

  return (
    <LectureContext.Provider value={{ lecture, chat, sendWSMessage }}>
      <div className={classes.container}>
        <div className={classes.line} />
        <Paper>
          <TopContainer isExpanded={isExpanded} expand={expand.toggle} />
          {isExpanded && (
            <>
              <Divider />
              <BottomContainer />
            </>
          )}
        </Paper>
      </div>
    </LectureContext.Provider>
  );
};

export default Lecture;
