import { render, screen, fireEvent } from '@testing-library/react';
import { Home } from '../app/page';
import { userEvent } from '@testing-library/user-event';

export const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui);
};

export const setupAuth = (isAuthenticated = false) => {
  jest.spyOn(global, 'fetch').mockImplementation((url: string) => {
    if (url.includes('/auth')) {
      return Promise.resolve({
        json: () => Promise.resolve({ isAuthenticated })
      });
    }
    return Promise.reject(new Error('Not mocked'));
  });
};

export const setupApiMocks = () => {
  const mockApi = {
    policies: {
      getAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    claims: {
      getAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    }
  };

  return mockApi;
};

export const setupForm = async (data: Record<string, string>) => {
  const form = screen.getByRole('form');
  for (const [key, value] of Object.entries(data)) {
    const input = screen.getByLabelText(new RegExp(key, 'i'));
    await userEvent.type(input, value);
  }
  return form;
};

export const setupError = (error: string) => {
  jest.spyOn(global, 'fetch').mockRejectedValue(new Error(error));
};
