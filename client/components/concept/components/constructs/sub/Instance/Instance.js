import React                                   from 'react';
import { InstanceConstruct }                   from 'spw-lang/lang/constructs/sub/instance/def';
import DelimitedConstruct                      from '../../DelimitedConstruct';
import useLatest                               from '../../../../../../util/hooks/useLatest';
import { BodyContent }                         from '../../DelimitedConstruct/components/Body';
import EssenceDisplay                          from '../Essence/Essence';
import { ConceptWidget }                       from '../../../../context/Provider';
import ConceptAnchor, { ConceptContextAnchor } from '../Anchor';


type InstanceDisplayProps = { instance: InstanceConstruct, };
export default function InstanceDisplay(props: InstanceDisplayProps) {
    const { instance } = props;
    const components   = useLatest(
        () => ({
            open:
                <ConceptWidget concept={instance.opener} />,
            body:
                <BodyContent
                    key="body content open"
                    body={instance.body}
                    display="block"
                />,
            close:
                `${instance.closer}`
        }),
        [instance.anchor]
    );
    return (
        <div className="spw-concept instance">
            <ConceptContextAnchor context={instance?.context} key={instance?.context?.anchor} />
            <DelimitedConstruct
                key="instance"
                name="spw-instance"
                construct={instance}
                components={components}
            />
            <EssenceDisplay essence={instance.essence} />
        </div>
    );
}
