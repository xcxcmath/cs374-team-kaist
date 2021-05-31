import React, { useState, useEffect, useMemo } from 'react';

import { observer } from 'mobx-react';
import useStore from '../hooks/use-store';
import { database } from '../stores/firebase';
import useDatabase, {
  useRequestDatabase,
  useUserDatabase,
} from '../hooks/use-database';

import {
  Grow,
  IconButton,
  Card,
  CardContent,
  Typography,
  Backdrop,
  CircularProgress,
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

import * as turf from '@turf/turf/dist/js';
import SwipeCard from '../components/swipeCard';
import NewRequest from './newRequest';
import Biography from './biography';

export default observer(function CompanionPanel() {
  const theme = useTheme();
  const {
    userID,
    openCompanionPanel,
    setOpenCompanionPanel,
    setSnackBarMessage,
  } = useStore();
  const { setOtherPlan, setIsOtherPlanValid } = useStore((it) => it.mapStore);
  const [currentPlan, , ,] = useUserDatabase(userID, 'path', (text) => {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  });
  const [companion, setCompanion, ,] = useUserDatabase(userID, 'companion');
  const [companionMessage, setCompanionMessage, ,] = useUserDatabase(
    userID,
    'companionMessage'
  );

  const [allRequests, , updateRequest] = useDatabase('requests');
  const requestsForPlan = useMemo(() => {
    if (!currentPlan) return [];
    try {
      const entries = Object.entries(allRequests);
      return entries
        .filter(([id, entry]) => {
          if (id === userID) return false;
          if (entry.status) return false;
          try {
            const path = JSON.parse(entry.path);
            const originDistance = turf.distance(
              turf.point(currentPlan.origin.center),
              turf.point(path.origin.center)
            );
            const destinationDistance = turf.distance(
              turf.point(currentPlan.destination.center),
              turf.point(path.destination.center)
            );
            return originDistance < 1 && destinationDistance < 1;
          } catch {
            return false;
          }
        })
        .map(([id, entry]) => {
          return [id, { ...entry }];
        });
    } catch {
      return [];
    }
  }, [currentPlan, allRequests, userID]);

  const [loading, setLoading] = useState(false);
  const [listIndex, setListIndex] = useState(0);
  const [thisCompanion, setThisCompanion] = useState(null);
  useEffect(() => {
    if (companion) {
      if (thisCompanion?.id !== companion) {
        setLoading(true);
        (async () => {
          const data = await database.ref(`users/${companion}`).get();
          setLoading(false);
          if (data.exists()) {
            setThisCompanion({ id: companion, entry: data.val() });
          } else {
            setThisCompanion(null);
          }
        })();
      }
    } else {
      const id = requestsForPlan[listIndex]?.[0] ?? null;
      if (id !== null && id !== undefined) {
        if (thisCompanion?.id !== id) {
          setLoading(true);
          database
            .ref(`users/${id}`)
            .get()
            .then((data) => {
              setLoading(false);
              if (data.exists()) {
                setThisCompanion({ id, entry: data.val() });
              }
            });
        }
      } else {
        setThisCompanion(null);
      }
    }
  }, [requestsForPlan, listIndex, companion]); // eslint-disable-line react-hooks/exhaustive-deps
  const [ownRequest, setOwnRequest, updateOwnRequest] = useDatabase(
    `requests/${userID}`
  );
  const [compRequest, setCompRequest] = useRequestDatabase(companion);
  const [seeingRequest] = useRequestDatabase(thisCompanion?.id);
  const isOwnRequest = useMemo(() => {
    return ownRequest ? true : false;
  }, [ownRequest]);
  const thisRequest = useMemo(() => {
    return ownRequest ?? compRequest ?? seeingRequest;
  }, [seeingRequest, ownRequest, compRequest]);

  const [openPostingPanel, setOpenPostingPanel] = useState(false);
  const [openProfilePanel, setOpenProfilePanel] = useState(false);

  useEffect(() => {
    if (!openCompanionPanel) {
      setListIndex(0);
    } else {
    }
  }, [openCompanionPanel]);

  let inside = <></>;
  if (!currentPlan) {
    inside = <>You don't have your own plan now.</>;
  } else if (companion) {
    if (thisRequest?.status === 'pending') {
      if (isOwnRequest) {
        inside = (
          <>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Here is a response for your request!
            </Typography>
            <SwipeCard
              image={thisCompanion?.entry?.profileImage}
              name={thisCompanion?.entry?.name}
              age={thisCompanion?.entry?.age}
              gender={thisCompanion?.entry?.gender}
              onBio={() => setOpenProfilePanel(true)}
              show
            />
          </>
        );
      } else {
        inside = (
          <>
            <SwipeCard empty waiting />
          </>
        );
      }
    } else if (thisRequest?.status === 'accepted') {
      inside = (
        <>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Your companion
          </Typography>
          <SwipeCard
            image={thisCompanion?.entry?.profileImage}
            name={thisCompanion?.entry?.name}
            age={thisCompanion?.entry?.age}
            gender={thisCompanion?.entry?.gender}
            onBio={() => setOpenProfilePanel(true)}
            time={thisRequest?.time}
            show
          />
        </>
      );
    } else {
      // something wrong? or loading..
      inside = (
        <>
          <SwipeCard empty waiting />
        </>
      );
    }
  } else if (isOwnRequest) {
    inside = (
      <>
        <SwipeCard empty waiting />
      </>
    );
  } else if (thisCompanion) {
    const { id, entry } = thisCompanion;
    inside = (
      <>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Here are others' companion requests.
        </Typography>
        <SwipeCard
          image={entry.profileImage}
          name={entry.name}
          age={entry.age}
          gender={entry.gender}
          time={thisRequest?.time}
          onLeft={() => setListIndex(listIndex > 0 ? listIndex - 1 : listIndex)}
          onRight={() => setListIndex(listIndex + 1)}
          onBio={() => {
            setOpenProfilePanel(true);
          }}
          show={id === companion}
        />{' '}
      </>
    );
  } else {
    inside = (
      <>
        <SwipeCard
          empty
          onLeft={() => setListIndex(listIndex > 0 ? listIndex - 1 : listIndex)}
          onYes={() => {
            setOpenPostingPanel(true);
          }}
        />
      </>
    );
  }

  useEffect(() => {
    if (companionMessage === 'declined') {
      console.log('declined');
      setSnackBarMessage(
        'Your respond was declined. How about finding another request?'
      );
    } else if (companionMessage === 'accepted') {
      setSnackBarMessage(`Companion matching is done!`);
    } else if (companionMessage === 'pending') {
      setSnackBarMessage(`Response to your request is here! Please check.`);
    } else if (companionMessage === 'deleted') {
      setSnackBarMessage(`Your companion just canceled the matching with you.`);
    }
    setCompanionMessage(null);
  }, [companionMessage, setCompanionMessage, setSnackBarMessage]);

  useEffect(() => {
    try {
      const pathString = thisCompanion?.entry?.path;
      if (pathString && openCompanionPanel) {
        const path = JSON.parse(pathString);
        setOtherPlan(path);
      } else {
        setOtherPlan(null);
      }
    } catch {
      setOtherPlan(null);
    }
  }, [thisCompanion, setOtherPlan, openCompanionPanel]);

  return (
    <>
      {openProfilePanel && (
        <Biography
          travelText={thisRequest?.travelText}
          visitText={thisRequest?.visitText}
          onPend={() => {
            if (thisCompanion) {
              setCompanion(thisCompanion.id);
              database
                .ref(`requests/${thisCompanion.id}`)
                .update({ status: 'pending' });
              database
                .ref(`users/${thisCompanion.id}`)
                .update({ companion: userID, companionMessage: 'pending' });
              setOpenProfilePanel(false);
              setSnackBarMessage(
                `Response to ${thisCompanion.entry.name} has been sent. Please wait...`
              );
            }
          }}
          onAccept={() => {
            if (thisCompanion) {
              updateOwnRequest({ status: 'accepted' });
              database
                .ref(`users/${thisCompanion.id}`)
                .update({ companionMessage: 'accepted' });
            }
            setOpenProfilePanel(false);
          }}
          onCancel={() => {
            setOpenProfilePanel(false);
          }}
          onDecline={() => {
            if (thisCompanion) {
              setCompanion(null);
              updateOwnRequest({ status: null });
              database
                .ref(`users/${thisCompanion.id}`)
                .update({ companion: null, companionMessage: 'declined' });
            }
            setOpenProfilePanel(false);
          }}
          onReportPosted={(text) => {
            if (text) {
              setSnackBarMessage(`Your report is posted.`);
            }
          }}
          status={thisRequest?.status}
          companion={thisCompanion}
          userID={userID}
        />
      )}
      {openPostingPanel && (
        <NewRequest
          onCancel={() => setOpenPostingPanel(false)}
          onCreate={(travelText, visitText, time) => {
            setOwnRequest({
              travelText,
              visitText,
              time,
              path: JSON.stringify(currentPlan),
            });
            setOpenPostingPanel(false);
          }}
        />
      )}
      <Backdrop open={loading && openCompanionPanel} style={{ zIndex: 10 }}>
        <CircularProgress />
      </Backdrop>
      <Grow in={openCompanionPanel} unmountOnExit mountOnEnter>
        <Card
          style={{
            position: 'absolute',
            width: '80vmin',
            maxWidth: 400,
            maxHeight: '40vmin',
            top: 5,
            left: 8,
            borderWidth: 3,
            borderStyle: 'solid',
            borderColor:
              thisRequest?.status === 'accepted'
                ? theme.palette.success.main
                : theme.palette.primary.main,
            zIndex: 3,
            transition: 'height 0.3s, width 0.3s',
            display: 'flex',
            justifyContent: 'center',
            padding: 3,
          }}
        >
          <IconButton
            size="small"
            onClick={() => {
              setOpenCompanionPanel(false);
            }}
            style={{ position: 'absolute', top: 0, right: 0 }}
            aria-label="Close Companion Card"
          >
            <CloseIcon />
          </IconButton>
          <CardContent style={{ padding: '8px 8px 16px 8px' }}>
            {inside}
          </CardContent>
        </Card>
      </Grow>
    </>
  );
});
