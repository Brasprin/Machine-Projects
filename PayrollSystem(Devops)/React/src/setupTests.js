// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

// Mock CSS modules
const mockCSSModules = {
  wrapper: "wrapper",
  mainContent: "mainContent",
  title: "title",
  searchBox: "searchBox",
  searchContainer: "searchContainer",
  tableContainer: "tableContainer",
  actionButton: "actionButton",
  noRecord: "noRecord",
}

// Configure module name mapping for CSS modules
Object.defineProperty(window, "CSS", { value: null })

const originalError = console.error;

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('ReactDOMTestUtils.act is deprecated')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});