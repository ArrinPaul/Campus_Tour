import { render, screen, fireEvent, act } from '@testing-library/react';
import { InfoModal } from './InfoModal';

describe('InfoModal', () => {
  it('renders the info button', () => {
    render(<InfoModal />);
    const infoButton = screen.getByLabelText('Open information modal');
    expect(infoButton).toBeInTheDocument();
  });

  it('opens the modal when the info button is clicked', async () => {
    render(<InfoModal />);
    const infoButton = screen.getByLabelText('Open information modal');
    await act(async () => {
        fireEvent.click(infoButton);
    });
    const modalTitle = screen.getByRole('heading', { name: /campus 360 tour/i });
    expect(modalTitle).toBeInTheDocument();
  });

  it('closes the modal when the close button is clicked', async () => {
    render(<InfoModal />);
    const infoButton = screen.getByLabelText('Open information modal');
    fireEvent.click(infoButton); // Open modal
    const closeButton = screen.getByLabelText('Close information modal');
    
    await act(async () => {
        fireEvent.click(closeButton); // Close modal
    });

    const modalTitle = screen.queryByRole('heading', { name: /campus 360 tour/i });
    expect(modalTitle).not.toBeInTheDocument();
  });

  it('closes the modal when clicking outside of it', async () => {
    render(<InfoModal />);
    const infoButton = screen.getByLabelText('Open information modal');
    fireEvent.click(infoButton); // Open modal

    // Click on the overlay background
    await act(async () => {
        fireEvent.click(screen.getByTestId('info-modal-overlay'));
    });

    const modalTitle = screen.queryByRole('heading', { name: /campus 360 tour/i });
    expect(modalTitle).not.toBeInTheDocument();
  });
});

