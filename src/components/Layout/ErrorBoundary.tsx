import React from 'react'
import ErrorPage from './ErrorPage'

interface Props {
  children: React.ReactNode
}

interface State {
  hasErrored: boolean
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      hasErrored: false,
    }
  }

  static getDerivedStateFromError(error: Error) {
    console.error(
      `ErrorBoundary has catched an error: ${error} during the getDerivedStateFromError method.`,
    )
    return { hasErrored: true }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(
      `ErrorBoundary has catched an error: ${error} with info: ${info} during the componentDidCatch method.`,
    )
  }

  render() {
    if (this.state.hasErrored) {
      return <ErrorPage />
    }

    return this.props.children
  }
}
