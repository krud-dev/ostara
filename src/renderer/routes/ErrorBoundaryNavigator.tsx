import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { urls } from './urls';
import { useErrorBoundary } from 'react-error-boundary';

type ErrorBoundaryNavigatorProps = {};

export default function ErrorBoundaryNavigator({}: ErrorBoundaryNavigatorProps) {
  const navigate = useNavigate();
  const { resetBoundary } = useErrorBoundary();

  useEffect(() => {
    resetBoundary();
    navigate(urls.error.url);
  }, []);

  return null;
}
