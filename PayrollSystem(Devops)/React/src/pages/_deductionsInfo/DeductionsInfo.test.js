import { fireEvent, render } from '@testing-library/react';
import DeductionsInfo from './DeductionsInfo';

describe('DeductionsInfo Component', () => {
  let deductions;
  let setDeductions;

  beforeEach(() => {
    deductions = {
      sss: 0,
      philHealth: 0,
      pagIbig: 0,
      cashAdvance: 0,
      healthCard: 0,
      lateHours: 0,
      absentDays: 0,
      otherDeductions: 0,
    };
    setDeductions = jest.fn();
  });

  it('renders all input fields', () => {
    const { getByLabelText } = render(
      <DeductionsInfo deductions={deductions} setDeductions={setDeductions} />
    );

    expect(getByLabelText(/SSS/i)).toBeInTheDocument();
    expect(getByLabelText(/philHealth/i)).toBeInTheDocument();
    expect(getByLabelText(/PAG-IBIG/i)).toBeInTheDocument();
    expect(getByLabelText(/Cash Advance/i)).toBeInTheDocument();
    expect(getByLabelText(/Health Card/i)).toBeInTheDocument();
    expect(getByLabelText(/Late \(in Hours\)/i)).toBeInTheDocument();
    expect(getByLabelText(/Absences \(per Day\)/i)).toBeInTheDocument();
    expect(getByLabelText(/Others/i)).toBeInTheDocument();
  });

  it('calls setDeductions when input changes', () => {
    const { getByLabelText } = render(
      <DeductionsInfo deductions={deductions} setDeductions={setDeductions} />
    );

    const sssInput = getByLabelText(/SSS/i);
    fireEvent.change(sssInput, { target: { value: '123.456' } });

    expect(setDeductions).toHaveBeenCalledWith(expect.any(Function));

    // Simulate state update function manually
    const updateFn = setDeductions.mock.calls[0][0];
    const result = updateFn(deductions);
    expect(result.sss).toBe(123.46); // Rounded to 2 decimals
  });

  it('resets value to 0 on invalid blur', () => {
    const { getByLabelText } = render(
      <DeductionsInfo deductions={deductions} setDeductions={setDeductions} />
    );

    const pagIbigInput = getByLabelText(/PAG-IBIG/i);
    fireEvent.blur(pagIbigInput, { target: { value: 'abc' } });

    expect(setDeductions).toHaveBeenCalledWith(expect.any(Function));

    const updateFn = setDeductions.mock.calls[0][0];
    const result = updateFn(deductions);
    expect(result.pagIbig).toBe(0);
  });
});
