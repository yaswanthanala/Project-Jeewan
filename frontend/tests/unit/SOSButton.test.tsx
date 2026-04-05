import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SOSButton from '@/components/SOSButton';

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
};

Object.defineProperty(navigator, 'geolocation', {
  writable: true,
  value: mockGeolocation,
});

describe('SOSButton Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders SOS button with correct text', () => {
    render(<SOSButton />);
    expect(screen.getByText(/EMERGENCY SOS/i)).toBeInTheDocument();
  });

  it('triggers geolocation on click', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({
        coords: { latitude: 28.6139, longitude: 77.2090 },
      });
    });

    render(<SOSButton />);
    const button = screen.getByRole('button', { name: /EMERGENCY SOS/i });

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
    });
  });

  it('shows confirmation message after successful trigger', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({
        coords: { latitude: 28.6139, longitude: 77.2090 },
      });
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({ success: true }),
      })
    ) as jest.Mock;

    render(<SOSButton />);
    const button = screen.getByRole('button', { name: /EMERGENCY SOS/i });

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Help is on the way/i)).toBeInTheDocument();
    });
  });

  it('renders different sizes correctly', () => {
    const { container: sm } = render(<SOSButton size="sm" />);
    const { container: lg } = render(<SOSButton size="lg" />);

    expect(sm.querySelector('button')).toHaveClass('h-10');
    expect(lg.querySelector('button')).toHaveClass('h-16');
  });
});
