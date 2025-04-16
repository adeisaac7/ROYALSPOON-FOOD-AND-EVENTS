import React from 'react';
import { renderToString } from 'react-dom/server';
import ConfirmationPage from '@/app/(routes)/confirmation/page';

export const renderConfirmationEmail = (orderDetails) => {
  const html = renderToString(
    <ConfirmationPage orderDetails={orderDetails} />
  );
  return html;
};