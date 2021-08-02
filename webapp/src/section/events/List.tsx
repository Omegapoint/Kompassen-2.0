import {
  ClickAwayListener,
  createStyles,
  Divider,
  Grow,
  IconButton,
  ListItem,
  ListItemIcon,
  makeStyles,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from '@material-ui/core';
import { Delete, Edit, MoreVert } from '@material-ui/icons';
import React, { KeyboardEvent, MouseEvent, ReactElement, useEffect, useRef } from 'react';
import { useMutation } from 'react-query';
import { deleteEvent } from '../../api/Api';
import DeleteDialog from '../../components/deleteDialog/DeleteDialog';
import useBoolean from '../../hooks/UseBoolean';
import { Event } from '../../lib/Types';
import { colors, padding } from '../../theme/Theme';

const useStyles = makeStyles(() =>
  createStyles({
    iconButton: {
      padding: padding.tiny,
    },
    icon: {
      color: colors.black,
    },
    link: {
      color: colors.black,
    },
  })
);

interface ListProps {
  event: Event;
  organisation: string;
  time: string;
  openEdit: () => void;
}

const List = ({ event, time, organisation, openEdit }: ListProps): ReactElement => {
  const classes = useStyles();
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, { off, toggle: handleToggle }] = useBoolean();
  const deleteEventRequest = useMutation(deleteEvent);
  const [deleteIsOpen, deleteFn] = useBoolean();

  const handleClose = (e: MouseEvent<EventTarget>) => {
    if (!anchorRef.current?.contains(e.target as HTMLElement)) {
      off();
    }
  };

  const openDelete = async (e: MouseEvent<EventTarget>) => {
    handleClose(e);
    deleteFn.on();
  };

  const handleDelete = async () => {
    await deleteEventRequest.mutateAsync({ id: event.id });
  };

  const handleEdit = async () => {
    openEdit();
  };

  function handleListKeyDown(e: KeyboardEvent) {
    if (e.key === 'Tab') {
      e.preventDefault();
      off();
    }
  }

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current && !open) {
      anchorRef.current?.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <IconButton
        className={classes.iconButton}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <MoreVert className={classes.icon} />
      </IconButton>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} onKeyDown={handleListKeyDown}>
                  <MenuItem onClick={handleEdit}>
                    <ListItemIcon>
                      <Edit fontSize="small" />
                      <ListItem className={classes.link}>Redigera</ListItem>
                    </ListItemIcon>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={openDelete}>
                    <ListItemIcon>
                      <Delete fontSize="small" />
                      <ListItem className={classes.link}>Ta bort</ListItem>
                    </ListItemIcon>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      <DeleteDialog
        open={deleteIsOpen}
        close={deleteFn.off}
        success={handleDelete}
        text={`Om du tar bort kompetensdagen "${organisation} ${time}" går den inte att få tillbaka.`}
      />
    </>
  );
};

export default List;
