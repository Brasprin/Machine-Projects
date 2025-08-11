import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MainMenu from './MainMenu';

// Mocks
jest.mock('../_sidebar/Sidebar', () => () => <div>Mock Sidebar</div>);
jest.mock('../_header/Header', () => () => <div>Mock Header</div>);

const mockLogout = jest.fn();

jest.mock('../../AuthContext', () => ({
  useAuth: () => ({
    logout: mockLogout
  }),
}));

describe('MainMenu', () => {
  beforeEach(() => {
    mockLogout.mockClear();
  });

  it('renders all menu buttons with correct ids', () => {
    render(
      <MemoryRouter>
        <MainMenu />
      </MemoryRouter>
    );

    expect(screen.getByText('Set Company Rates')).toBeInTheDocument();
    expect(screen.getByText('Calculate Employee Payroll')).toBeInTheDocument();
    expect(screen.getByText('View Payroll History')).toBeInTheDocument();
    expect(screen.getByText('Add Employee')).toBeInTheDocument();
    expect(screen.getByText('Edit Employee')).toBeInTheDocument();
    expect(screen.getByText('Exit')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /Set Company Rates/i })).toHaveAttribute('id', 'set-default-button');
    expect(screen.getByRole('link', { name: /Calculate Employee Payroll/i })).toHaveAttribute('id', 'calculate-payroll-button');
    expect(screen.getByRole('link', { name: /View Payroll History/i })).toHaveAttribute('id', 'view-payroll-button');
    expect(screen.getByRole('link', { name: /Add Employee/i })).toHaveAttribute('id', 'add-employee-button');
    expect(screen.getByRole('link', { name: /Edit Employee/i })).toHaveAttribute('id', 'edit-employee-button');
    expect(screen.getByRole('link', { name: /Exit/i })).toHaveAttribute('id', 'exit-button');
  });

  it('calls logout when Exit button is clicked', async () => {
    render(
      <MemoryRouter>
        <MainMenu />
      </MemoryRouter>
    );

    const exitButton = screen.getByRole('link', { name: /Exit/i });
    fireEvent.click(exitButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
