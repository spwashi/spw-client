import React, { useContext, useEffect, useRef }       from 'react';
import classnames                                from 'classnames';
import { action }                                     from '../../../../../util/action';
import useStageContext                                from '../../../stage/Stage/hooks/useStageContext';
import SpaceReporter                                  from '../SpaceReporter';
import { useSpaceContextValue }                       from './context/hooks/useContextCreator';
import type { SpaceNodeContextValue, SpaceNodeState } from './context/types';
import useSpaceNodeReducer                            from './reducer';
import { SpaceNodeContext }                           from './hooks/useSpaceContext';
import useLatest                                      from '../../../../../util/hooks/useLatest';

interface SpaceNodeContainerProps {
    sentinel?: false | boolean,
    display?: 'inline' | undefined;
    Component?: React.ReactNode;
    className?: string,
    position?: string | 'open' | 'close' | 'body';
    elProps?: {};
    data?: {} | *;

    children?: React.ReactChildren;
}

function useSpaceDiscoveryHandlers(dispatch, id) {
    const parentContext: SpaceNodeContextValue = useContext(SpaceNodeContext);

    const key        = [dispatch, id, parentContext];
    const spaceFound = React.useCallback(
        rect => {
            if (!rect) return;
            dispatch(action('space-found', { rect, parentContext }));
            if (parentContext) parentContext.registerChild(id);
        },
        key
    );

    return { spaceFound };
}

function useStageEffects(state: SpaceNodeState, context) {
    const { dispatch, actions } = useStageContext();
    React.useEffect(
        () =>
            // dispatch(actions.createRegisterNode({ id: state.id, state, context }));
            () => dispatch(actions.createUnregisterNode({ id: state.id })),
        [state.id]
    );
    React.useEffect(
        () => {
            dispatch(actions.createUpdateNode({ id: state.id, state, context }));
        },
        [JSON.stringify(state.rect)]
    );
}

type NodeIntent = 'monitor';
type DisplayProps = {
    className: string,
    position: string,
    elProps?: {},
    display: string,
};
type ReportProps = {
    elRef: *,
    Component?: Function,
    spaceFound: Function,
    spaceDestroyed: Function,
};
type FillProps = {
    constraints?: {},
};
type BodyProps = {
    id: string,
    intent: null,
    displayProps: DisplayProps,
    reportProps: ReportProps,
    fillProps: FillProps,
};

function SpaceNodeBody(props: BodyProps) {
    const
        {
            children: body,
            id,
            intent,
            reportProps,
            displayProps,
            fillProps
        } = props;

    return (
        <SpaceReporter
            id={id}
            ref={reportProps.elRef}

            mode={intent}

            className={displayProps.className}
            position={displayProps.position}

            display={displayProps.display}
            elProps={displayProps.elProps}

            Component={reportProps.Component}
            constraints={fillProps.constraints}
            rect={fillProps.rect}
            onSpaceFound={reportProps.spaceFound}
            onSpaceDestroyed={reportProps.spaceDestroyed}
        >
            {body}
        </SpaceReporter>
    );
}

export default function SpaceNode(props: SpaceNodeContainerProps) {
    const { position, display, className } = props;
    const { constraints }                  = props;
    const { elProps, Component }           = props;
    const { children: body }               = props;
    const { onStateChange }                = props;
    /* -- state -- */
    const { state, dispatch }     = useSpaceNodeReducer(props);
    const { rect, id, sentinel }  = state;
    const { invalidated, intent } = state;


    // ref
    const elRef    = useRef();
    const reporter = elRef.current;

    // context
    const context: SpaceNodeContextValue =
              useSpaceContextValue(
                  {
                      id,
                      reporter,
                      state,
                      dispatch,
                      intent
                  }
              );

    /* -- effects -- */
    const parentContext: SpaceNodeContextValue = useContext(SpaceNodeContext);
    useEffect(
        () => {
            const isInitializeAttempt = intent === 'initialize';
            const isRerender          = intent === 'rerender' || intent === 'constrain';

            if (isInitializeAttempt || (isRerender && invalidated)) {
                dispatch({ type: 'activate' });
                if (parentContext) {
                    if (isInitializeAttempt) {
                        parentContext.registerChild(id);
                    } else {
                        parentContext.queueUpdate();
                    }
                }
            }
        },
    );

    useStageEffects(state, context);
    useEffect(() => { onStateChange && onStateChange(state); }, [rect]);
    useEffect(() => () => {
        dispatch(action('destroy'));
        return parentContext?.unregisterChild(id);
    }, []);
    useEffect(
        () => {
            if (!parentContext) return;
            context.queueUpdate();
        },
        [!!state?.children?.length]
    );


    /* -- props -- */
    const displayProps: DisplayProps = useLatest(
        () => ({
            elProps,
            display,
            position,
            className:
                classnames(
                    [
                        className,
                        sentinel && 'sentinel',
                        invalidated ? 'invalidated' : 'valid'
                    ]
                )
        }),
        [elProps, display, position, className, invalidated]
    );

    const discovery = useSpaceDiscoveryHandlers(dispatch, id);

    const reportProps: ReportProps =
              useLatest(
                  () => (
                      {
                          elRef,
                          Component,
                          spaceFound: discovery.spaceFound
                      }
                  ),
                  [
                      elRef,
                      Component,
                      discovery.spaceFound
                  ]
              );

    const fillProps: FillProps =
              useLatest(
                  () => (
                      {
                          constraints,
                          rect
                      }
                  ),
                  [
                      constraints,
                      rect,
                      !!state.invalidated
                  ]
              );


    return (
        <SpaceNodeContext.Provider value={context}>
            <SpaceNodeBody
                id={id}
                intent={intent}
                displayProps={displayProps}
                reportProps={reportProps}
                fillProps={fillProps}
            >
                {body}
            </SpaceNodeBody>
        </SpaceNodeContext.Provider>
    );
}
