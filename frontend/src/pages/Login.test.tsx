import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

vi.mock('../api/authApi', () => ({
  authApi: {
    login: vi.fn(),
    getRememberedEmail: vi.fn(() => null),
    getLastLogin: vi.fn(() => null),
  },
}));

vi.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render login form', () => {
    renderWithRouter(<Login />);
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    renderWithRouter(<Login />);
    
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('should show invalid email error for invalid format', async () => {
    renderWithRouter(<Login />);
    
    const user = userEvent.setup();
    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    
    await user.type(emailInput, 'invalid@email'); // has @ but no dot
    await user.type(passwordInput, 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/email is invalid/i)).toBeInTheDocument();
    });
  });

  it('should toggle password visibility', async () => {
    renderWithRouter(<Login />);
    
    const user = userEvent.setup();
    const passwordInput = screen.getByPlaceholderText(/enter your password/i) as HTMLInputElement;
    const toggleButton = screen.getByRole('button', { name: '' });

    expect(passwordInput.type).toBe('password');
    
    await user.click(toggleButton);
    
    expect(passwordInput.type).toBe('text');
  });

  it('should have Google login button', () => {
    renderWithRouter(<Login />);
    expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
  });

  it('should have forgot password link', () => {
    renderWithRouter(<Login />);
    expect(screen.getByRole('link', { name: /forgot password/i })).toBeInTheDocument();
  });

  it('should have sign up link', () => {
    renderWithRouter(<Login />);
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
  });

  it('should have remember me checkbox', () => {
    renderWithRouter(<Login />);
    expect(screen.getByRole('checkbox', { name: /remember me/i })).toBeInTheDocument();
  });
});