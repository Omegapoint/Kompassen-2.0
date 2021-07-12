import { createContext, Dispatch, SetStateAction } from 'react';
import { Event } from '../../lib/Types';

interface EventCtx {
  events: Event[];
  event: Event;
  ind: number;
  setInd: Dispatch<SetStateAction<number>>;
}

const EventContext = createContext<EventCtx>({} as EventCtx);

export default EventContext;
