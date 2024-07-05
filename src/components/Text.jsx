'use client';

import React from 'react';
import './Text.css';

const Text = ({ text }) => {
  const processURLs = (text) => {
    if (text.includes('<a href=')) {
      return text;
    }
    const urlRegex = /(https?:\/\/[^\s,]+)/g;
    return text.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
  }

  const processReferences = (text) => {
    const boldRegex = /(\*\*|__)*(Referencias:)\1/g;
    return text.replace(boldRegex, '<b>$2</b>');
  }

  const textHtml = {__html: processURLs(processReferences(text))};
  
  return (
    <div className="text" dangerouslySetInnerHTML={textHtml}></div>
  );
};

export default Text;