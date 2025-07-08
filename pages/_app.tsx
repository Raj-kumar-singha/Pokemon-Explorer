import React from 'react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

// Suppress fetchPriority warnings
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = (...args) => {
    if (args[0]?.includes?.('fetchPriority')) return;
    originalError.call(console, ...args);
  };
}

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
