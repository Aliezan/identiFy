import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import Navibar from '../../src/components/navbar/Navibar';
import userEvent from '@testing-library/user-event';

jest.mock('next-auth/react');

describe('Navbar functionality', () => {
  describe('Logged out state', () => {
    beforeEach(async () => {
      (useSession as jest.Mock).mockReturnValue({
        data: null,
        status: 'unauthenticated',
      });
      render(<Navibar />);
    });

    it('No profile picture when user has not logged in', () => {
      const profilePic = screen.queryByTestId('profile-pic');
      expect(profilePic).not.toBeInTheDocument();
    });

    it('Navbar links when user are not authenticated', () => {
      const logoLink = screen.getByRole('link', { name: /home/i });
      const aboutLink = screen.getByRole('link', { name: /about/i });
      const homeLink = screen.getByRole('link', { name: /home/i });

      expect(aboutLink).toHaveAttribute('href', '/about');
      expect(homeLink).toHaveAttribute('href', '/');
      expect(logoLink).toHaveAttribute('href', '/');
    });
  });

  describe('Logged in state', () => {
    beforeEach(async () => {
      (useSession as jest.Mock).mockReturnValue({
        data: {
          user: {
            name: 'aliezan',
            email: 'test@mail.com',
          },
        },
        status: 'authenticated',
      });
      render(<Navibar />);
    });

    it('Profile picture is displayed when user has logged in', () => {
      const profilePic = screen.getByTestId('profile-pic');
      expect(profilePic).toBeInTheDocument();
    });

    it('username and email displayed in dropdown', async () => {
      const user = userEvent.setup();
      await user.click(screen.getByTestId('dropdown-button'));

      const userName = screen.getByTestId('user-name');
      const userEmail = screen.getByTestId('user-email');

      expect(userName).toHaveTextContent(/aliezan/i);
      expect(userEmail).toHaveTextContent(/test@mail.com/i);
    });
  });
});
