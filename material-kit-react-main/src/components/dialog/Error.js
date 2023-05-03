import React, { Component, useEffect, useState } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Error:', error);
    console.log('Error Info:', errorInfo);
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

function MyComponent() {
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    try {
      // Some code that might throw an error
    } catch (e) {
      setError(e);
    }
  }, [/* Dependencies */]);

  if (error) {
    console.log('Error:', error);
    return <h1>Something went wrong.</h1>;
  }

  return <div>Hello World!</div>;
}
