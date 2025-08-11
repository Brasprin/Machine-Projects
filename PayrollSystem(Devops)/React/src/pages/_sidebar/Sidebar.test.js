import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Sidebar';

// Mocks
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const mockLogout = jest.fn(() => Promise.resolve());
jest.mock('../../AuthContext', () => ({
  useAuth: () => ({
    logout: mockLogout
  })
}));

describe('Header (Sidebar) component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLogout.mockClear();
  });

  it('navigates correctly on button clicks', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/MAIN MENU/i));
    expect(mockNavigate).toHaveBeenCalledWith('/MainMenu');

    fireEvent.click(screen.getByText(/SET COMPANY RATES/i));
    expect(mockNavigate).toHaveBeenCalledWith('/SetDefaults');


    fireEvent.click(screen.getByText(/PAYROLL HISTORY/i));
    expect(mockNavigate).toHaveBeenCalledWith('/SearchEmployee/ViewPayrollHistory');

    fireEvent.click(screen.getByText(/CALCULATE PAYROLL/i));
    expect(mockNavigate).toHaveBeenCalledWith('/SearchEmployee/CalculatePayroll');

    fireEvent.click(screen.getByText(/ADD EMPLOYEE/i));
    expect(mockNavigate).toHaveBeenCalledWith('/AddEmployee');

    fireEvent.click(screen.getByText(/EDIT EMPLOYEE/i));
    expect(mockNavigate).toHaveBeenCalledWith('/EditEmployee');

    fireEvent.click(screen.getByText(/BACK/i));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('calls logout and navigates to root on EXIT click', async () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/EXIT/i));

    // Wait for logout to be awaited
    expect(mockLogout).toHaveBeenCalledTimes(1);
    // Ensure it navigates to root
    await Promise.resolve(); // Flush promise
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
