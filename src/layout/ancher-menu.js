import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

import { action } from 'mobx';
import { observer } from 'mobx-react';
import useStore from '../hooks/use-store';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

export default observer(function AncherMenu() {
  const classes = useStyles();
  const { ancherMenuOpen, setAncherMenuOpen } = useStore((it) => it);

  return (
    <Drawer
      anchor="left"
      open={ancherMenuOpen}
      onClose={action(() => setAncherMenuOpen(false))}
    >
      <div
        className={classes.list}
        role="presentation"
        onClick={action(() => setAncherMenuOpen(false))}
        onKeyDown={action(() => setAncherMenuOpen(false))}
      >
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  );
});
