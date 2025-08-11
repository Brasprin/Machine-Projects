import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Popup from './Popup';

// Mock BASE_URL if needed
jest.mock('../../ConfigContext', () => ({
  BASE_URL: 'http://localhost:3000',
}));

describe('Popup Component', () => {
  const mockSetTrigger = jest.fn();
  const mockSetUserPayments = jest.fn();

  const defaultProps = {
    trigger: true,
    pid: '12345',
    setTrigger: mockSetTrigger,
    setUserPayments: mockSetUserPayments,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders popup when trigger is true', () => {
    render(<Popup {...defaultProps} />);
    expect(screen.getByText(/ARE YOU SURE/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /YES/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /NO/i })).toBeInTheDocument();
  });

  it('does not render when trigger is false', () => {
    render(<Popup {...defaultProps} trigger={false} />);
    expect(screen.queryByText(/ARE YOU SURE/i)).not.toBeInTheDocument();
  });

  it('calls setTrigger(false) when NO is clicked', () => {
    render(<Popup {...defaultProps} />);
    const noButton = screen.getByRole('button', { name: /NO/i });
    fireEvent.click(noButton);
    expect(mockSetTrigger).toHaveBeenCalledWith(false);
  });

  it('calls delete API and updates state when YES is clicked', async () => {
    const mockResponse = { message: 'Deleted successfully' };

    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    );

    render(<Popup {...defaultProps} />);

    const yesButton = screen.getByRole('button', { name: /YES/i });
    fireEvent.click(yesButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `http://localhost:3000/deletePayment/12345`,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
      expect(mockSetUserPayments).toHaveBeenCalled();
      expect(mockSetTrigger).toHaveBeenCalledWith(false);
    });
  });
});
