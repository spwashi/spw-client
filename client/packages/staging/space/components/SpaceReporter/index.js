import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSpaceReporterReducer, } from './effects';
import useRectUpdatingEffect from './hooks/useRectUpdatingEffect';
import useSpaceReportingEffect from './hooks/useSpaceReportingEffect';
import './scss/space-reporter.scss';
import useQueue from '../../../../../util/hooks/useQueue';
import useLatest from '../../../../../util/hooks/useLatest';
import classnames from 'classnames';

function useElProps(props: SpaceReporterProps, itemClassName = '') {
    const [nextProps, setNextProps] = useState({});
    const { elProps }               = props;

    const origClassName = elProps?.className || '';
    const className     = `${itemClassName} ${origClassName}`;

    const key = [
        elProps,
        className,
        props.display,
        props.position
    ];

    function updateProps() {
        const base         = { className };
        const { display }  = props;
        const { position } = props;

        const style = { position, ...elProps?.style || {}, };
        if (display) style.display = display;
        if (position) style.position = position;
        setNextProps(Object.assign({}, base, elProps, { style }));
    }

    useEffect(updateProps, key);
    return nextProps;
}

export interface SpaceReporterProps {
    children: React.ReactChildren;
    Component?: Function;
    onSpaceFound: (rect: DOMRect)=>*;
    onSpaceDestroyed: () => *;
    display?: 'inline';
    className?: string;
    position?: 'relative';
    id: string;
}

const getHtmlID = (id, mode) => `${id}-${mode}`;

const Div = React.forwardRef((props, ref) => <div data-g {...props} ref={ref} />);

function useSpaceReporter({ id, onSpaceDestroyed, onSpaceFound }, ref) {
    // The state is basically just the DOMRect
    const [state, dispatch] = useSpaceReporterReducer();
    const { rect }          = state;

    // This is what communicates to the outside
    const reportHandlers = [onSpaceFound, onSpaceDestroyed];
    const reportKey      = [rect];
    useSpaceReportingEffect(rect, reportHandlers, reportKey);

    // Schedule the update
    const [internalKey, setInternalKey] = useState();
    const setRandomInternalKey          = useCallback(p => setInternalKey(Math.random()));
    useQueue(setRandomInternalKey, 'space-reporter', 0);

    // Change the DOMRect internally
    useRectUpdatingEffect(ref?.current, internalKey, dispatch);
    return { rect };
}

function useSpaceConstraints({ rect, constraints, display }, active = false) {
    const style =
              useLatest(
                  () => (
                      !active ? {}
                              : {
                              position: 'relative',

                              height:    rect?.height,
                              // minHeight: constraints?.minHeight || rect?.width,
                              maxHeight: constraints?.maxHeight || rect?.height,

                              width:    rect?.width,
                              minWidth: constraints?.minWidth || rect?.width,
                              maxWidth: constraints?.maxWidth || rect?.width,


                              display: display || undefined
                          }
                  ),
                  [display, rect, constraints, active]
              );
    return { style };
}

const Spy =
          React
              .forwardRef(
                  (
                      {
                          id,
                          onSpaceFound,
                          onSpaceDestroyed
                      },
                      ref
                  ) => {
                      const { rect } = useSpaceReporter({ id, onSpaceFound, onSpaceDestroyed }, ref);
                      return null;
                  }
              );

function SpaceReporter(props: SpaceReporterProps, ref) {
    const { position, className, display }       = props;
    const { mode, children }                     = props;
    const { constraints }                        = props;
    const { onSpaceFound, id, onSpaceDestroyed } = props;
    const sentinelMode                           = mode === 'report';
    const modeHistory                            = useRef([]).current;

    useEffect(() => { modeHistory.push(mode); }, [mode]);

    const [rect, setRect] = useState();
    const { style }       = useSpaceConstraints({ rect, constraints, display }, !sentinelMode);
    const elProps         = useElProps(props, sentinelMode ? 'space-reporter' : 'space-constraint');
    const htmlID          = getHtmlID(id, mode);
    const { Component }   = props;
    const prevMode        = modeHistory[modeHistory.length];

    const full_className =
              classnames(
                  [
                      `space-${mode}-wrapper`,
                      'space-node-wrapper',
                      `pos-${position}`,
                      `${className || ''}`,
                      prevMode !== mode && prevMode ? `mode-changed ${prevMode}-to-${mode}` : ''
                  ]
              );
    const TrueComponent  = Component || Div;
    return (
        <TrueComponent
            id={htmlID}

            {...elProps}

            ref={ref}
            style={style}
            className={full_className}
        >
            {
                sentinelMode
                ? (
                    <Spy
                        ref={ref}
                        onStateUpdate={({ rect }) => setRect(rect)}
                        onSpaceFound={onSpaceFound}
                        onSpaceDestroyed={onSpaceDestroyed}
                        id={id}
                    />
                )
                : null
            }
            {children}
        </TrueComponent>
    );
}

export default React.forwardRef(SpaceReporter);
