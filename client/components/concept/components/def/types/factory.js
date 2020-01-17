import React             from 'react';
import type { IConcept } from 'spw-lang/lang/constructs/def/types/types';

export type IConceptDisplayFactory = ({ concept: IConcept })=>React.ReactNode;
