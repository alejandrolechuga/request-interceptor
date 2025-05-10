import { printLine } from './modules/print';

// This keeps track of the origal js HTTP request functions
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  printLine('fetch', args);
  await originalFetch(...args);
  // apply rule here
  const hardcodedResponse = {
    status: 200,
    statusText: 'OK',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  // todo here add rule matching
  return new Response(JSON.stringify({ test: 'hola' }), hardcodedResponse);
};
