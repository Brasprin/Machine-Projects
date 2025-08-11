import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ConfigContext } from '../../ConfigContext';
import SettingsMenu from './SettingsMenu';

// Mock fetch globally
global.fetch = jest.fn();

const mockSetTrigger = jest.fn();

const renderComponent = (trigger = true) => {
  const contextValue = {
    password: 'currentPass',
    setPassword: jest.fn(),
    username: 'testUser',
  };

  return render(
    <ConfigContext.Provider value={contextValue}>
      <SettingsMenu trigger={trigger} setTrigger={mockSetTrigger} />
    </ConfigContext.Provider>
  );
};

beforeEach(() => {
  fetch.mockReset();
  mockSetTrigger.mockReset();
});

test('renders SettingsMenu when trigger is true', () => {
  renderComponent(true);
  expect(screen.getByText('Settings')).toBeInTheDocument();
  expect(screen.getByText('Change Password')).toBeInTheDocument();
});

test('does not render SettingsMenu when trigger is false', () => {
  renderComponent(false);
  expect(screen.queryByText('Settings')).not.toBeInTheDocument();
});

test('handles password change success', async () => {
  fetch.mockResolvedValueOnce({
    status: 200,
    json: async () => ({}),
  });

  renderComponent(true);

  fireEvent.change(screen.getByLabelText(/Old Password/i), {
    target: { value: 'old123' },
  });
  fireEvent.change(screen.getByLabelText(/New Password/i), {
    target: { value: 'new123' },
  });

  fireEvent.click(screen.getByText('Confirm Changes'));

  await waitFor(() =>
    expect(screen.getByText('Password Changed.')).toBeInTheDocument()
  );
});

test('shows error if old password is wrong', async () => {
  fetch.mockResolvedValueOnce({
    status: 401,
    json: async () => ({}),
  });

  renderComponent(true);

  fireEvent.change(screen.getByLabelText(/Old Password/i), {
    target: { value: 'wrongold' },
  });
  fireEvent.change(screen.getByLabelText(/New Password/i), {
    target: { value: 'newpass' },
  });

  fireEvent.click(screen.getByText('Confirm Changes'));

  await waitFor(() =>
    expect(screen.getByText('Wrong old password')).toBeInTheDocument()
  );
});

test('shows message if passwords are the same', async () => {
  fetch.mockResolvedValueOnce({
    status: 402,
    json: async () => ({}),
  });

  renderComponent(true);

  fireEvent.change(screen.getByLabelText(/Old Password/i), {
    target: { value: 'samepass' },
  });
  fireEvent.change(screen.getByLabelText(/New Password/i), {
    target: { value: 'samepass' },
  });

  fireEvent.click(screen.getByText('Confirm Changes'));

  await waitFor(() =>
    expect(
      screen.getByText('New password cannot be the same as the old one.')
    ).toBeInTheDocument()
  );
});

test('handles unexpected error', async () => {
  fetch.mockRejectedValueOnce(new Error('Network Error'));

  renderComponent(true);

  fireEvent.change(screen.getByLabelText(/Old Password/i), {
    target: { value: 'pass1' },
  });
  fireEvent.change(screen.getByLabelText(/New Password/i), {
    target: { value: 'pass2' },
  });

  fireEvent.click(screen.getByText('Confirm Changes'));

  await waitFor(() =>
    expect(
      screen.getByText('Something went wrong. Please try again.')
    ).toBeInTheDocument()
  );
});

test('calls setTrigger(false) on exit', () => {
  renderComponent(true);

  fireEvent.click(screen.getByRole('button', { name: '' })); // close button

  expect(mockSetTrigger).toHaveBeenCalledWith(false);
});

