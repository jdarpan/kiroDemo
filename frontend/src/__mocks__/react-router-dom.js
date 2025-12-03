import React from 'react';

const mockNavigate = jest.fn();

module.exports = {
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ element }) => element || null,
  Navigate: () => null,
  useNavigate: () => mockNavigate,
  MemoryRouter: ({ children }) => <div>{children}</div>,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
};
