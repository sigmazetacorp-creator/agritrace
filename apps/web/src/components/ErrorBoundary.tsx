'use client'

import React from 'react'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-96 flex items-center justify-center">
          <div className="max-w-md w-full">
            <div className="bg-[#1e2028] rounded-2xl border border-red-500/20 p-8 text-center">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-white mb-3">Something went wrong</h2>
              <p className="text-gray-400 text-sm mb-6">
                An unexpected error occurred. Please try refreshing the page or contact support.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-red-900/20 border border-red-500/30 rounded p-4 mb-6 text-left">
                  <p className="text-xs text-red-300 font-mono break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2 bg-[#F9D548] text-[#181A20] rounded font-bold hover:bg-yellow-300 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
