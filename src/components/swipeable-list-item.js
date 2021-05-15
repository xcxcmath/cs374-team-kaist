import React, { useRef, useReducer } from 'react';

import {
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  backgroundClass: {
    position: `absolute`,
    width: `100%`,
    height: `100%`,
    zIndex: -1,
    display: `flex`,
    flexDirection: `row`,
    justifyContent: `space-between`,
    alignItems: `center`,
    paddingRight: 16,
    color: `#fff`,
    backgroundColor: `#663bb7`,
    boxSizing: `border-box`,
  },
  listItemClass: {
    backgroundColor: `#fff`,
    transition: `transform 0.3s ease-out`,
  },
  wrapperClass: {
    position: `relative`,
    transition: `max-height 0.5s ease`,
    transformOrigin: `top`,
    overflow: `hidden`,
    width: `100%`,
  },
  classeZoeira: {
    border: `1px solid`,
    borderColor: `red`,
  },
}));

const initialState = {
  wrapperMaxHeight: 1000,
  diff: 0,
  dragged: false,
  dragStartX: 0,
  isAnimating: false,
  side: 'left',
  startTime: 0,
};

const SwipeableListItem = ({
  avatar,
  background,
  disableDeleteAnimation = false,
  itemIcon,
  ListItemAvatarProps = {},
  ListItemIconProps = {},
  ListItemProps = {},
  ListItemSecondaryActionProps = {},
  ListItemTextProps = {},
  onSwipedLeft,
  onSwipedRight,
  primaryText,
  secondaryAction,
  secondaryText,
  threshold = 0.3,
}) => {
  const classes = useStyles();
  const { backgroundClass, listItemClass, wrapperClass } = classes;
  const listElementEl = useRef(document.createElement('li'));

  const [state, dispatch] = useReducer(reducer, initialState);

  function reducer(state, action) {
    switch (action.type) {
      case 'on-drag-start-touch':
        return {
          ...state,
          dragged: true,
          dragStartX: action.payload.clientX,
          isAnimating: true,
          startTime: Date.now(),
        };

      case 'on-drag-end-touch':
        const { dragged, diff } = state;
        const { offsetWidth } = action.payload;
        if (dragged) {
          if (diff < offsetWidth * threshold * -1) {
            return {
              ...state,
              dragged: false,
              diff: -offsetWidth * 2,
              ...(disableDeleteAnimation ? {} : { wrapperMaxHeight: 0 }),
            };
          } else if (diff > offsetWidth * threshold) {
            return { ...state, dragged: false, diff: offsetWidth * 2 };
          } else {
            return { ...state, dragged: false, diff: 0 };
          }
        }
        return state;

      case 'on-touch-move':
        const newDiff = action.payload.clientX - state.dragStartX;
        if (newDiff !== 0) {
          return {
            ...state,
            diff: newDiff,
            side: newDiff > 0 ? 'right' : 'left',
          };
        }
        return state;

      case 'falsify-animation':
        return {
          ...state,
          ...(action.payload && action.payload.keepDiff ? {} : { diff: 0 }),
          isAnimating: false,
        };

      default:
        return state;
    }
  }

  const { className, ...restOfListItemProps } = ListItemProps;
  const { diff, dragged, dragStartX, isAnimating, side, wrapperMaxHeight } =
    state;
  const onDragStartTouch = (e) => {
    const { clientX } = e.touches[0];
    dispatch({ type: 'on-drag-start-touch', payload: { clientX } });
  };
  const onDragEndTouch = () => {
    const { offsetWidth } = listElementEl.current;
    dispatch({ type: 'on-drag-end-touch', payload: { offsetWidth } });
  };
  const onTouchMove = (e) => {
    const { clientX } = e.touches[0];
    dispatch({ type: 'on-touch-move', payload: { clientX } });
  };

  const onTransitionEnd = (e) => {
    e.persist();
    const { propertyName } = e;
    const propertyCheck =
      disableDeleteAnimation || propertyName === `max-height`;
    if (
      side === `left` &&
      propertyCheck &&
      !dragged &&
      diff < listElementEl.current.offsetWidth * threshold * -1
    ) {
      onSwipedLeft(e);
      if (disableDeleteAnimation) {
        dispatch({ type: 'falsify-animation' });
      }
    } else if (
      side === `right` &&
      !dragged &&
      diff > listElementEl.current.offsetWidth * threshold
    ) {
      console.log(e);
      onSwipedRight(e);
      dispatch({ type: 'falsify-animation' });
    } else {
      dispatch({ type: 'falsify-animation', payload: { keepDiff: true } });
    }
  };

  const {
    actionIconLeft,
    actionIconRight,
    backgroundColorLeft,
    backgroundColorRight,
  } = background;

  const getOpacity = () => {
    const opacity = parseFloat((Math.abs(diff) / 100).toFixed(2));
    if (opacity < 1) {
      return opacity;
    }
    return 1;
  };

  return (
    <>
      <div
        className={wrapperClass}
        data-testid="wrapper-list-item"
        onTransitionEnd={onTransitionEnd}
        style={{
          maxHeight: !disableDeleteAnimation ? wrapperMaxHeight : undefined,
        }}
      >
        <ListItem
          className={backgroundClass}
          data-testid="action-list-item"
          divider={dragged}
          style={{
            backgroundColor:
              side === `left` ? backgroundColorLeft : backgroundColorRight,
            justifyContent: side === `left` ? `flex-end` : `flex-start`,
            opacity: getOpacity(),
          }}
        >
          {side === `left` ? actionIconLeft : actionIconRight}
        </ListItem>
        <ListItem
          {...restOfListItemProps} // eslint-disable-line react/jsx-props-no-spreading
          className={[listItemClass, className].join(` `)}
          data-testid="draggable-list-item"
          divider={dragged}
          onTouchStart={onDragStartTouch}
          onTouchMove={onTouchMove}
          onTouchEnd={onDragEndTouch}
          // @ts-ignore
          ref={listElementEl}
          style={{
            transform: `translateX(${diff}px)`,
          }}
        >
          {itemIcon && (
            <ListItemIcon
              data-testid="list-item-icon"
              {...ListItemIconProps} // eslint-disable-line react/jsx-props-no-spreading
            >
              {itemIcon}
            </ListItemIcon>
          )}
          {avatar && (
            <ListItemAvatar
              data-testid="list-item-avatar"
              {...ListItemAvatarProps} // eslint-disable-line react/jsx-props-no-spreading
            >
              {avatar}
            </ListItemAvatar>
          )}
          <ListItemText
            {...ListItemTextProps} // eslint-disable-line react/jsx-props-no-spreading
            primary={primaryText}
            secondary={secondaryText}
          />
          {secondaryAction && (
            <ListItemSecondaryAction
              data-testid="list-secondary-action"
              {...ListItemSecondaryActionProps} // eslint-disable-line react/jsx-props-no-spreading
              style={{
                transition:
                  dragged || isAnimating
                    ? undefined
                    : `visibility 0.15s ease-out 0.15s`,
                visibility: dragged || isAnimating ? `hidden` : `visible`,
              }}
            >
              {secondaryAction}
            </ListItemSecondaryAction>
          )}
        </ListItem>
      </div>
    </>
  );
};

export default SwipeableListItem;
