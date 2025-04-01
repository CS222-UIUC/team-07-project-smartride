// test.tsx, useless but to test GitHub whether it can demonstrate status_checks correctly by triggering eslint, frontend-test and format-check workflows

import React from "react";

// A simple functional component that does nothing but is written correctly
const TestComponent: React.FC = () => {
  const message: string =
    "This is a test component that does nothing but is written correctly.";

  return <div>{message}</div>;
};

const addNumbers = (a: number, b: number): number => {
  return a + b;
};

export default TestComponent;

// Call the function and render component in some other place
const result = addNumbers(1, 2);
console.log(`Result of addNumbers: ${result.toString()}`);
