import Color                    from 'color';
import React, { createContext } from 'react';
import useLatest                from '../../../../util/hooks/useLatest';

type ColorHex = string;
type ColorString = ColorHex;
type KeyColorRegisterer = (key: any, color: ColorString)=>void;
type KeyColorResolver = (key: any, color: ColorString)=> Color;
type ColorContextValue = {
    color: Color;
    registry: Map<any, Color>;
    registerKey: KeyColorRegisterer;
    resolveKey: KeyColorResolver;
}

const ColorContext: ColorContextValue = createContext();

const i      = 0;
const hexes  =
          [
              '#666684',
              '#000000',
              '#f099f0',
              '#d8222b',
              '#588C73',
              '#F2AE72',
              '#D96459',
              '#8C4646',
              '#354458',
              '#3A9AD9',
              '#29ABA4',
              '#EB7260',
              '#E45F56',
              '#A3D39C',
              '#7ACCC8',
              '#4AAAA5',
              '#35404F',
              '#0F5959',
              '#17A697',
              '#638CA6',
              '#8FD4D9',
              '#D93240',
              '#F17D80',
              '#737495',
              '#68A8AD',
              '#C4D4AF',
              '#6C8672',
          ];
const colors = { light: [], dark: [] };
hexes
    .forEach(
        hex => {
            const color = Color(hex);
            if (color.isLight()) colors.light.push(color);
            else colors.dark.push(color);
        }
    );

let colorI;

function aColor(light) {
    // const colorArr = hexes.map(hex => Color(hex));
    const colorArr = light ? colors.light : colors.dark;
    colorI         = colorI >= colorArr.length - 1 || typeof colorI !== 'undefined'
                     ? Date.now() % (colorArr.length - 1)
                     : (colorI || 0) + 1;
    const color    = colorArr[colorI];
    return color?.hex();
}

export function useColor(details: { intent: 'read' }, def): ColorContextValue {
    const context: ColorContextValue         = React.useContext(ColorContext);
    const { color, resolveKey, registerKey } = context || {};

    // Generic color
    if (details === undefined && color && !def) {
        return { color };
    }

    if (!context) return { color: Color(def) };

    // Try to resolve based on color use
    let resolved = resolveKey(details);

    // register new color
    if (!resolved) {
        resolved = registerKey(details, def);
    }

    return { color: resolved };
}

function useKeyRegistryCallbacks(defaultColor = aColor(), inherit = false)
    : {
    registry: Map,
    registerKey: KeyColorRegisterer,
    resolveKey: KeyColorResolver
} {
    const { useState, useContext } = React;

    const parent: ColorContextValue    = useContext(ColorContext);
    const [registry: Map, setRegistry] = useState(inherit ? parent.registry : new Map);

    const { useCallback }                 = React;
    const registerKey: KeyColorRegisterer =
              useCallback(
                  (key: any, color: ColorString): Color => {
                      registry.set(key, Color(color || defaultColor));
                      return registry.get(key);
                  },
                  [registry]
              );
    const resolveKey                      =
              useCallback((key: any) => registry.get(key), [registry]);
    return { registerKey, resolveKey, registry };
}

type ColorContextProviderProps =
    {
        colorKey: any,
        color?: ColorString,
        inherit?: boolean,
        defaultColor?: ColorString,
        children: React.ReactChildren
    };
export default function ColorContextProvider(props: ColorContextProviderProps) {
    const
        {
            children,
            inherit,
            defaultColor,
            color:    initial = defaultColor,
            colorKey: key
        } = props;

    const { useState, useContext }                 = React;
    const { color: parentColor }: { color: Color } = useContext(ColorContext) || {};
    const [seed]                                   = useState(initial || defaultColor || aColor(!!parentColor?.isDark()));
    const { registry, registerKey, resolveKey }    = useKeyRegistryCallbacks(defaultColor, inherit);
    const [color, setColor]                        = useState(resolveKey(key));
    const context                                  = useLatest(
        () => ({
            color,
            registry,
            registerKey,
            resolveKey
        }),
        [color, registry]
    );
    React.useEffect(() => {
        if (registry.has(key)) return;
        setColor(registerKey(key, color || seed));
    }, [key, seed]);


    return (
        <ColorContext.Provider value={context}>
            {children}
        </ColorContext.Provider>
    );
}
