export type Action_SpaceFound = { type: 'space-found', payload: { rect: DOMRect } };
export type Action_Reset = { type: 'reset' };
export type SpaceReporterAction = Action_SpaceFound | Action_Reset;
