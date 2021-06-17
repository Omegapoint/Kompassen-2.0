import { MouseEvent, useState } from 'react';

interface UseAnchorReturn {
  open: boolean;
  anchorEl: HTMLButtonElement | null;
  handleClose: () => void;
  handleClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

const useAnchor = (): UseAnchorReturn => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClose = () => setAnchorEl(null);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const open = Boolean(anchorEl);

  return { handleClose, handleClick, open, anchorEl };
};
export default useAnchor;
