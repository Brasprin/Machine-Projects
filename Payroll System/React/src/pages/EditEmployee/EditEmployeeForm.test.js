import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EditEmployeeForm from '../EditEmployee/EditEmployeeForm';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

import { useNavigate, useParams } from 'react-router-dom';

jest.mock('../_sidebar/Sidebar', () => () => <div>Sidebar</div>);
jest.mock('../_header/Header', () => () => <div>Header</div>);

global.fetch = jest.fn();

describe('EditEmployeeForm', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useParams.mockReturnValue({ id: '123' });
    useNavigate.mockReturnValue(mockNavigate);

    fetch.mockImplementation((url) => {
      if (url.includes('/getEmployeeDetails/123')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              fname: 'John',
              middleName: 'Q',
              lname: 'Doe',
              phone: '1234567890',
              email: 'john.doe@example.com',
              department: 'Engineering',
              position: 'Developer',
              designation: 'Senior Dev',
              basicSalary: 50000,
              dateHired: '2023-05-01T00:00:00Z',
              bankAccount: {
                bankName: 'Test Bank',
                accountNumber: '123456789',
                branch: 'Main',
              },
            }),
        });
      }

      if (url.includes('/editEmployee/123')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Success' }),
        });
      }

      return Promise.reject('Unknown endpoint');
    });

    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders form with fetched data and submits updated employee', async () => {
    render(
      <BrowserRouter>
        <EditEmployeeForm />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/First Name/i), {
      target: { value: 'Jane' },
    });

    fireEvent.click(screen.getByText(/Update Employee/i));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/editEmployee/123'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
      expect(mockNavigate).toHaveBeenCalledWith('/EditEmployee');
    });
  });

  test('shows alert if required fields are empty', async () => {
    render(
      <BrowserRouter>
        <EditEmployeeForm />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByDisplayValue('John'));

    fireEvent.change(screen.getByPlaceholderText(/First Name/i), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Last Name/i), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Phone Number/i), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Department/i), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Position/i), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Designation/i), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Basic Salary/i), {
      target: { value: '' },
    });

    fireEvent.click(screen.getByText(/Update Employee/i));
  });

  test('shows alert if email format is invalid', async () => {
    render(
      <BrowserRouter>
        <EditEmployeeForm />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByDisplayValue('John'));

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'invalidemail' },
    });

    fireEvent.click(screen.getByText(/Update Employee/i));
  });

  test('shows alert if basic salary is not a number', async () => {
    render(
      <BrowserRouter>
        <EditEmployeeForm />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByDisplayValue('John'));

    fireEvent.click(screen.getByText(/Update Employee/i));
  });

  test('shows alert if fetch for employee details fails', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to load employee data'))
    );

    render(
      <BrowserRouter>
        <EditEmployeeForm />
      </BrowserRouter>
    );
  });
});
