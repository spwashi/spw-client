import { useCallback, useEffect, useState } from 'react';
import level                                from 'level';

const db = level('spw-concepts');


const updateDatabase =
          async (name, content) => {
              try {
                  const response = await db.put(name, content);
              } catch (e) {
                  console.log(e);
                  return false;
              }
              return true;
          };
const readDatabase   =
          async name => {
              try {
                  return db.get(name);
              } catch (e) {
                  console.log(e);
                  throw e;
              }
          };

export function useSaveContent(name, content: any, saveKey, options: { active: boolean }) {
    const { active }                = options;
    const [lastSaved, setLastSaved] = useState();
    const save                      =
              useCallback(
                  () => {
                      if (typeof content === 'undefined') return;
                      if (!active) return;
                      updateDatabase(name, content)
                          .then(
                              response => {
                                  if (response) console.log(response);
                                  setLastSaved(Date.now());
                              }
                          );
                  }, [name, content]
              );

    useEffect(
        save,
        Array.isArray(saveKey) ? saveKey : [saveKey]
    );

    return { lastSaved };
}

export function useReadContent(name, readKey) {
    const [content, setContent] = useState();

    useEffect(
        () => {
            console.log('reading database', name);

            readDatabase(name).then(setContent);
        },
        Array.isArray(readKey) ? readKey : [readKey]
    );

    return content;
}
