import { Divider } from '@mui/material';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import useBoolean from '../../hooks/UseBoolean';
import useUnmount from '../../hooks/UseUnmount';
import { formatDates, useAppSelector } from '../../lib/Lib';
import { Lecture as LectureTP, LectureMessage, UpdatedLectureMessage } from '../../lib/Types';
import RowPaper from '../rowPaper/RowPaper';
import BottomContainer from './BottomContainer';
import LectureContext from './LectureContext';
import TopContainer from './TopContainer';

interface LectureProps {
  lecture: LectureTP;
}

const useLectureWS = (lectureID: string) => {
  const socket = useAppSelector((state) => state.session.socket);
  const [chat, setChat] = useState<LectureMessage[]>([]);
  const mounted = useUnmount();

  useEffect(() => {
    if (socket) {
      socket.on(`lectureChat/${lectureID}/initial`, (messages) => {
        if (mounted.current) {
          setChat(formatDates(messages));
        }
      });
      socket.on(`lectureChat/${lectureID}/message`, (message) => {
        if (mounted.current) {
          setChat((m) => [...m, formatDates(message)]);
        }
      });
      socket.emit('lectureChat/join', lectureID);

      return () => {
        socket.emit('lectureChat/leave', lectureID);
      };
    }
    return () => {};
  }, [lectureID, mounted, socket]);

  const sendWSMessage = useCallback(
    (message: string) => socket.emit('lectureChat/message', lectureID, message),
    [lectureID, socket]
  );

  const updateWSMessage = useCallback(
    (msg: UpdatedLectureMessage) => socket.emit('lectureChat/message/update', msg.id, msg.message),
    [socket]
  );

  const deleteWSMessage = useCallback(
    (msg: UpdatedLectureMessage) => {
      socket.emit('lectureChat/message/delete', msg);
    },
    [socket]
  );

  return { chat, sendWSMessage, updateWSMessage, deleteWSMessage };
};

const Lecture = ({ lecture }: LectureProps): ReactElement => {
  const [isExpanded, expand] = useBoolean();
  const { chat, sendWSMessage, updateWSMessage, deleteWSMessage } = useLectureWS(lecture.id);

  return (
    <LectureContext.Provider
      value={{ lecture, chat, sendWSMessage, updateWSMessage, deleteWSMessage }}
    >
      <RowPaper>
        <TopContainer isExpanded={isExpanded} expand={expand.toggle} />
        {isExpanded && <Divider />}
        {isExpanded && <BottomContainer />}
      </RowPaper>
    </LectureContext.Provider>
  );
};

export default Lecture;
