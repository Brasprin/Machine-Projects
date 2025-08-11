import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigContext } from '../../ConfigContext';
import Login from './Login';

// Mock BASE_URL
const BASE_URL = 'http://mock-api.com';

// Mock navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ to, children }) => <a href={to}>{children}</a>,
}));

describe('Login Component', () => {
  let setUsernameMock;

  const renderLogin = () => {
    setUsernameMock = jest.fn();
    render(
      <ConfigContext.Provider value={{ setUsername: setUsernameMock, BASE_URL }}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </ConfigContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it('renders login form', () => {
    renderLogin();
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    // Mock fetch success response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        ok: true,
        json: () => Promise.resolve({
          username: 'testuser',
          company: { id: '123', name: 'TestCompany' },
        }),
      })
    );

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(setUsernameMock).toHaveBeenCalledWith('testuser');
      expect(sessionStorage.getItem('userValid')).toBe('true');
      expect(sessionStorage.getItem('company')).toBe('123');
      expect(sessionStorage.getItem('companyName')).toBe('TestCompany');
      expect(sessionStorage.getItem('username')).toBe('testuser');
      expect(mockNavigate).toHaveBeenCalledWith('/MainMenu');
    });
  });

  it('shows error message on 401 response', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 401,
        ok: false,
        json: () => Promise.resolve({ error: 'Unauthorized' }),
      })
    );

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'wronguser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument();
    });
  });

  it('shows error message on fetch failure', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'user' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'pass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });
});
