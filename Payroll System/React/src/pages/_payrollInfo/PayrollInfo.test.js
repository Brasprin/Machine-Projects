import { fireEvent, render, screen } from '@testing-library/react';
import PayrollInfo from './PayrollInfo';

describe('PayrollInfo Component', () => {
  let payrollInfo;
  let setPayrollInfo;

  beforeEach(() => {
    payrollInfo = {
      date: '2025-07-13',
      ot: 2,
      salaryIncrease: 100,
      mealAllow: 50,
      bdayBonus: 30,
      incentive: 20,
      otherPayrollInfo: 10,
    };

    setPayrollInfo = jest.fn((updater) => {
      // simulate useState updater function
      payrollInfo = typeof updater === 'function' ? updater(payrollInfo) : updater;
    });
  });

  it('calls setPayrollInfo on number input change with formatted float', () => {
    render(<PayrollInfo payrollInfo={payrollInfo} setPayrollInfo={setPayrollInfo} />);
    
    const overtimeInput = screen.getByLabelText(/Overtime/i);

    fireEvent.change(overtimeInput, { target: { value: '3.456' } });

    // apply the mock to simulate state update and test new state
    const call = setPayrollInfo.mock.calls[0][0];
    const newState = typeof call === 'function' ? call(payrollInfo) : call;

    expect(newState).toEqual(expect.objectContaining({
      ...payrollInfo,
      ot: 3.46,
    }));
  });
});
