import { render, screen } from '@testing-library/react';
import ResultsInfo from './ResultsInfo';

describe('ResultsInfo', () => {
  const mockResults = {
    payroll: 12345.678,
    deductions: 234.56,
    total: 12111.118,
  };

  beforeEach(() => {
    render(<ResultsInfo results={mockResults} />);
  });

  it('renders the correct labels', () => {
    expect(screen.getByLabelText(/PAYROLL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/DEDUCTIONS/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/TOTAL/i)).toBeInTheDocument();
  });

  it('displays formatted values correctly', () => {
    expect(screen.getByLabelText(/PAYROLL/i)).toHaveValue('12345.68');
    expect(screen.getByLabelText(/DEDUCTIONS/i)).toHaveValue('234.56');
    expect(screen.getByLabelText(/TOTAL/i)).toHaveValue('12111.12');
  });
});
