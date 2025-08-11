import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Header from './Header';

jest.mock('./logo.svg', () => 'logo.svg');
jest.mock('./setting.svg', () => 'setting.svg');

jest.mock('./SettingsMenu', () => ({ trigger }) => (
  <div data-testid="settings-menu">{trigger ? 'Settings Open' : 'Settings Closed'}</div>
));

describe('Header', () => {
  test('renders logo and setting icons', () => {
    render(<Header />);
    const imgs = screen.getAllByRole('img');
    expect(imgs.length).toBe(2); // logo and setting icons
  });

  test('opens settings menu when setting icon is clicked', () => {
    render(<Header />);
    expect(screen.getByTestId('settings-menu')).toHaveTextContent('Settings Closed');

    const settingIcon = screen.getAllByRole('img')[1]; // second image
    fireEvent.click(settingIcon);

    expect(screen.getByTestId('settings-menu')).toHaveTextContent('Settings Open');
  });
});
