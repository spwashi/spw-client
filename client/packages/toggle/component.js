import React from 'react';

export function Toggler(props: { open: boolean, children: *, setOpen: Function }) {
    const { open, children, setOpen } = props;
    return <a type="button" onClick={() => setOpen(!open)}>{children || 'toggle'}</a>;
}
