import React, { ReactElement, useEffect, useRef, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { Lecture } from '../../lib/Types';
import LectureCard from './LectureCard';

interface ExampleCardProps {
  lecture: Lecture;
  colHeight: number;
  handleDragStop: (startPos: Position, { x, y }: Position) => void;
  rowToTime?: (y: number) => Date;
  startY: number;
  startX: number;
}

export interface Position {
  x: number;
  y: number;
}

export default function ScheduledLecture({
  lecture,
  colHeight,
  handleDragStop,
  rowToTime,
  startY,
  startX,
}: ExampleCardProps): ReactElement {
  const [controlledPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<Position | null>(null);
  const [newY, setNewY] = useState(0);

  useEffect(() => {
    if (pos) {
      handleDragStop({ y: startY, x: startX }, pos);
    }
  }, [handleDragStop, pos, startX, startY]);

  const handleDrag = (e: DraggableEvent, d: DraggableData) => {
    setNewY(d.y);
  };

  return (
    <Draggable
      bounds=".fullSchedule"
      nodeRef={ref}
      position={controlledPosition}
      grid={[1, colHeight]}
      scale={1}
      onDrag={handleDrag}
      onStop={(_, { x, y }) => setPos({ x, y })}
    >
      <div ref={ref} style={{ cursor: 'grab' }}>
        <LectureCard lecture={lecture} startAt={rowToTime && rowToTime(startY + newY)} />
      </div>
    </Draggable>
  );
}
