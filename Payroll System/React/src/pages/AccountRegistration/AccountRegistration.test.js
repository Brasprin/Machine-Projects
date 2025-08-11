import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ConfigContext } from '../../ConfigContext';
import AccountRegistration from './AccountRegistration';

// Mock fetch globally
global.fetch = jest.fn();

// Mock navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('AccountRegistration', () => {
  const renderWithConfig = () => {
    render(
      <ConfigContext.Provider value={{}}>
        <MemoryRouter>
          <AccountRegistration />
        </MemoryRouter>
      </ConfigContext.Provider>
    );
  };

  beforeEach(() => {
    fetch.mockReset();
    sessionStorage.clear();
  });

  it('renders all input fields and buttons', () => {
    renderWithConfig();
    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Company/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^REGISTER$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^LOGIN$/i })).toBeInTheDocument();
  });

  it('updates input fields on change', () => {
    renderWithConfig();
    fireEvent.change(screen.getByPlaceholderText(/Username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'secret' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Company/i), {
      target: { value: 'TestCorp' },
    });

    expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
    expect(screen.getByDisplayValue('secret')).toBeInTheDocument();
    expect(screen.getByDisplayValue('TestCorp')).toBeInTheDocument();
  });

  it('navigates to MainMenu on successful registration', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ username: 'testuser', company: 'TestCorp' }),
    });

    renderWithConfig();

    fireEvent.change(screen.getByPlaceholderText(/Username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'secret' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Company/i), {
      target: { value: 'TestCorp' },
    });

    fireEvent.click(screen.getByRole('button', { name: /^REGISTER$/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/MainMenu');
      expect(sessionStorage.getItem('userValid')).toBe('true');
      expect(sessionStorage.getItem('company')).toBe('TestCorp');
      expect(sessionStorage.getItem('username')).toBe('testuser');
    });
  });

  it('shows error message if account already exists (409)', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 409,
    });

    renderWithConfig();

    fireEvent.change(screen.getByPlaceholderText(/Username/i), {
      target: { value: 'existinguser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'secret' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Company/i), {
      target: { value: 'TestCorp' },
    });

    fireEvent.click(screen.getByRole('button', { name: /^REGISTER$/i }));

    await waitFor(() => {
      expect(screen.getByText(/Account already exists/i)).toBeInTheDocument();
    });
  });

  it('shows generic error for other failures', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    renderWithConfig();

    fireEvent.change(screen.getByPlaceholderText(/Username/i), {
      target: { value: 'newuser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'secret' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Company/i), {
      target: { value: 'TestCorp' },
    });

    fireEvent.click(screen.getByRole('button', { name: /^REGISTER$/i }));

    await waitFor(() => {
      expect(screen.getByText(/Login failed/i)).toBeInTheDocument();
    });
  });

  it('shows network error if fetch throws', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    renderWithConfig();

    fireEvent.change(screen.getByPlaceholderText(/Username/i), {
      target: { value: 'networkfail' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'secret' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Company/i), {
      target: { value: 'TestCorp' },
    });

    fireEvent.click(screen.getByRole('button', { name: /^REGISTER$/i }));

    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    });
  });
});
