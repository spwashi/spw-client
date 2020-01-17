import React, { Component } from 'react';

export default class ParserErrorBoundary extends Component<{ children: React.Children }> {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error, info) {
        console.log(error, info);
    }

    render() {
        const { hasError, error } = this.state;
        const { children } = this.props;

        if (hasError) return (
            [
                <button key="reset" onClick={()=>this.setState({hasError: false, error: null})}>reset</button>,
                <pre>{JSON.stringify(error)}</pre>
            ]
        );

        return children;
    }
}
