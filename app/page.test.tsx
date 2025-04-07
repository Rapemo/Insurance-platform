import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Home } from './page';
import userEvent from '@testing-library/user-event';
import { setupAuth, setupApiMocks, setupForm, setupError } from '../../tests/utils/test-utils';

describe('Home Page', () => {
  beforeEach(() => {
    render(<Home />);
  });

  it('renders without crashing', () => {
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
  });

  it('has a navigation menu with all required links', () => {
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();

    // Check for specific navigation links
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(5); // Adjust based on actual number of links
    
    // Verify specific link texts
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Claims/i)).toBeInTheDocument();
    expect(screen.getByText(/Quote/i)).toBeInTheDocument();
  });

  describe('Authentication', () => {
    it('handles initial login state', () => {
      const loginButton = screen.getByRole('button', { name: /login/i });
      expect(loginButton).toBeInTheDocument();
      expect(loginButton).toBeEnabled();
    });

    it('handles successful login', async () => {
      fireEvent.click(screen.getByText(/login/i));
      await waitFor(() => {
        const logoutButton = screen.getByRole('button', { name: /logout/i });
        expect(logoutButton).toBeInTheDocument();
      });
    });

    it('handles failed login', async () => {
      fireEvent.click(screen.getByText(/login/i));
      await waitFor(() => {
        const errorMessage = screen.getByText(/login failed/i);
        expect(errorMessage).toBeInTheDocument();
      });
    });
  });

  describe('Insurance Features', () => {
    it('displays policy creation form when authenticated', async () => {
      setupAuth(true);
      render(<Home />);
      
      // Navigate to policy creation
      fireEvent.click(screen.getByText(/create policy/i));
      await waitFor(() => {
        const form = screen.getByRole('form');
        expect(form).toBeInTheDocument();
        
        // Check required fields
        expect(screen.getByLabelText(/policy number/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/insured name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/coverage amount/i)).toBeInTheDocument();
      });
    });

    it('handles policy creation with valid data', async () => {
      setupAuth(true);
      const mockApi = setupApiMocks();
      
      render(<Home />);
      fireEvent.click(screen.getByText(/create policy/i));
      
      // Fill out form
      await setupForm({
        'Policy Number': 'POL123456',
        'Insured Name': 'John Doe',
        'Coverage Amount': '100000'
      });

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
      
      // Verify success
      await waitFor(() => {
        expect(screen.getByText(/policy created successfully/i)).toBeInTheDocument();
      });
    });

    it('handles policy creation with invalid data', async () => {
      setupAuth(true);
      
      render(<Home />);
      fireEvent.click(screen.getByText(/create policy/i));
      
      // Submit empty form
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
      
      // Verify validation errors
      await waitFor(() => {
        expect(screen.getByText(/policy number is required/i)).toBeInTheDocument();
        expect(screen.getByText(/insured name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/coverage amount must be a number/i)).toBeInTheDocument();
      });
    });

    it('handles claim submission', async () => {
      setupAuth(true);
      
      render(<Home />);
      fireEvent.click(screen.getByText(/submit claim/i));
      
      // Fill out claim form
      await setupForm({
        'Claim Amount': '5000',
        'Description': 'Car accident damage',
        'Policy Number': 'POL123456'
      });

      // Submit claim
      fireEvent.click(screen.getByRole('button', { name: /submit claim/i }));
      
      // Verify claim submission
      await waitFor(() => {
        expect(screen.getByText(/claim submitted successfully/i)).toBeInTheDocument();
      });
    });

    it('handles claim submission errors', async () => {
      setupAuth(true);
      setupError('Policy not found');
      
      render(<Home />);
      fireEvent.click(screen.getByText(/submit claim/i));
      
      // Submit claim with invalid policy
      await setupForm({
        'Claim Amount': '5000',
        'Description': 'Car accident damage',
        'Policy Number': 'INVALID123'
      });

      // Verify error
      await waitFor(() => {
        expect(screen.getByText(/policy not found/i)).toBeInTheDocument();
      });
    });

    it('displays policy dashboard for authenticated users', async () => {
      setupAuth(true);
      
      render(<Home />);
      fireEvent.click(screen.getByText(/dashboard/i));
      
      await waitFor(() => {
        expect(screen.getByText(/active policies/i)).toBeInTheDocument();
        expect(screen.getByText(/pending claims/i)).toBeInTheDocument();
        expect(screen.getByText(/total coverage/i)).toBeInTheDocument();
      });
    });

    it('handles policy cancellation', async () => {
      setupAuth(true);
      
      render(<Home />);
      fireEvent.click(screen.getByText(/manage policies/i));
      
      // Select policy to cancel
      fireEvent.click(screen.getByText(/cancel policy/i));
      
      // Confirm cancellation
      fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/policy cancelled successfully/i)).toBeInTheDocument();
      });
    });

    it('handles quote generation', async () => {
      setupAuth(true);
      
      render(<Home />);
      fireEvent.click(screen.getByText(/generate quote/i));
      
      // Fill out quote form
      await setupForm({
        'Coverage Type': 'auto',
        'Vehicle Value': '25000',
        'Deductible': '500'
      });

      // Generate quote
      fireEvent.click(screen.getByRole('button', { name: /generate quote/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/monthly premium/i)).toBeInTheDocument();
        expect(screen.getByText(/total coverage/i)).toBeInTheDocument();
      });
    });

    it('handles quote generation errors', async () => {
      setupAuth(true);
      setupError('Invalid vehicle value');
      
      render(<Home />);
      fireEvent.click(screen.getByText(/generate quote/i));
      
      // Submit invalid quote
      await setupForm({
        'Coverage Type': 'auto',
        'Vehicle Value': 'invalid',
        'Deductible': '500'
      });

      await waitFor(() => {
        expect(screen.getByText(/invalid vehicle value/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('displays error messages', async () => {
      // Simulate API error
      jest.spyOn(global, 'fetch').mockRejectedValue(new Error('API Error'));
      
      fireEvent.click(screen.getByText(/submit/i));
      await waitFor(() => {
        const errorElement = screen.getByTestId('error-message');
        expect(errorElement).toBeInTheDocument();
        expect(errorElement).toHaveTextContent('An error occurred');
      });
    });

    it('handles network errors gracefully', async () => {
      // Simulate network error
      jest.spyOn(global, 'fetch').mockImplementation(() => {
        throw new Error('Network Error');
      });

      fireEvent.click(screen.getByText(/submit/i));
      await waitFor(() => {
        const errorElement = screen.getByTestId('error-message');
        expect(errorElement).toBeInTheDocument();
        expect(errorElement).toHaveTextContent('Network Error');
      });
    });

    it('handles API errors gracefully', async () => {
      setupError('API Error');
      
      render(<Home />);
      fireEvent.click(screen.getByText(/submit claim/i));
      
      await waitFor(() => {
        expect(screen.getByText(/an error occurred/i)).toBeInTheDocument();
        expect(screen.getByText(/API Error/i)).toBeInTheDocument();
      });
    });

    it('handles network errors', async () => {
      jest.spyOn(global, 'fetch').mockImplementation(() => {
        throw new Error('Network Error');
      });
      
      render(<Home />);
      fireEvent.click(screen.getByText(/submit claim/i));
      
      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Handling', () => {
    it('validates form inputs', async () => {
      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();

      // Submit empty form
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
      await waitFor(() => {
        const errorMessages = screen.getAllByText(/required/i);
        expect(errorMessages).toHaveLength(2); // Adjust based on form fields
      });

      // Fill out form
      const emailInput = screen.getByLabelText(/email/i);
      await userEvent.type(emailInput, 'test@example.com');

      // Submit valid form
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
      await waitFor(() => {
        const successMessage = screen.getByText(/success/i);
        expect(successMessage).toBeInTheDocument();
      });
    });

    it('handles form submission errors', async () => {
      // Fill out form
      const emailInput = screen.getByLabelText(/email/i);
      await userEvent.type(emailInput, 'invalid-email');

      // Submit with invalid data
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
      await waitFor(() => {
        const validationError = screen.getByText(/invalid email/i);
        expect(validationError).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    it('renders quickly', () => {
      const startTime = performance.now();
      render(<Home />);
      const endTime = performance.now();
      
      // Assert render time is under 100ms
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('handles large data sets', () => {
      // Mock large dataset
      jest.spyOn(global, 'fetch').mockResolvedValue({
        json: () => Promise.resolve({ data: Array(1000).fill({ id: 1, name: 'Test' }) })
      });

      // Verify rendering doesn't crash
      render(<Home />);
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('handles large policy lists efficiently', async () => {
      setupAuth(true);
      
      // Mock large dataset
      jest.spyOn(global, 'fetch').mockResolvedValue({
        json: () => Promise.resolve({
          policies: Array(1000).fill({
            id: 1,
            policyNumber: 'POL123456',
            insuredName: 'Test Policy',
            coverageAmount: 100000
          })
        })
      });
      
      const startTime = performance.now();
      render(<Home />);
      fireEvent.click(screen.getByText(/dashboard/i));
      
      await waitFor(() => {
        const policies = screen.getAllByRole('listitem');
        expect(policies).toHaveLength(1000);
      });
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(1000); // Should render in less than 1 second
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      // Check for proper ARIA attributes
      const mainContent = screen.getByRole('main');
      expect(mainContent).toBeInTheDocument();

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();

      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();
    });

    it('has proper keyboard navigation', () => {
      const focusableElements = screen.getAllByRole('button');
      expect(focusableElements).toHaveLength(2); // Adjust based on actual buttons

      // Test tab order
      const loginButton = screen.getByRole('button', { name: /login/i });
      expect(loginButton).toHaveFocus();
    });

    it('has proper ARIA attributes for insurance features', () => {
      render(<Home />);
      
      // Check policy creation form
      const policyForm = screen.getByRole('form', { name: /create policy/i });
      expect(policyForm).toBeInTheDocument();
      
      // Check claim submission form
      const claimForm = screen.getByRole('form', { name: /submit claim/i });
      expect(claimForm).toBeInTheDocument();
      
      // Check dashboard navigation
      const dashboardNav = screen.getByRole('navigation', { name: /dashboard/i });
      expect(dashboardNav).toBeInTheDocument();
    });

    it('has proper keyboard navigation for insurance features', () => {
      render(<Home />);
      
      // Test tab order
      const focusableElements = screen.getAllByRole('button');
      expect(focusableElements).toHaveLength(5); // Adjust based on actual buttons
      
      // Verify proper focus management
      const createPolicyButton = screen.getByRole('button', { name: /create policy/i });
      expect(createPolicyButton).toHaveFocus();
    });
  });
});
