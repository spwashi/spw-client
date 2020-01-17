import React     from 'react';
import useLatest from '../../../util/hooks/useLatest';

const compareInputs                  = (inputKeys, oldInputs, newInputs, message) => {
    inputKeys.forEach(key => {
        const oldInput = oldInputs[key];
        const newInput = newInputs[key];
        if (oldInput !== newInput) {
            console.log(message || 'change detected', key, 'old:', oldInput, 'new:', newInput);
        }
    });
};
const isDev                          = false;
export const useDependenciesDebugger =
                 (inputs, message) => {
                     if (!inputs) return;
                     const oldInputsRef     = React.useRef(inputs);
                     const inputValuesArray = Object.values(inputs);
                     const inputKeysArray   = Object.keys(inputs);
                     useLatest(
                         () => {
                             const oldInputs = oldInputsRef.current;

                             compareInputs(inputKeysArray, oldInputs, inputs, message);

                             oldInputsRef.current = inputs;
                         },
                         inputValuesArray
                     ); // eslint-disable-line react-hooks/exhaustive-deps
                 };
