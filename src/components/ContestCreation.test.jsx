import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContestCreation from './ContestCreation';

// Mock the useToast hook
jest.mock('@chakra-ui/react', () => {
  const originalModule = jest.requireActual('@chakra-ui/react');
  return {
    ...originalModule,
    useToast: jest.fn(),
  };
});

describe('ContestCreation', () => {
  const mockAddContest = jest.fn();
  const mockToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    require('@chakra-ui/react').useToast.mockReturnValue(mockToast);
  });

  test('renders Create Contest button', () => {
    render(<ContestCreation addContest={mockAddContest} />);
    expect(screen.getByText('Create Contest')).toBeInTheDocument();
  });

  test('opens drawer when Create Contest button is clicked', () => {
    render(<ContestCreation addContest={mockAddContest} />);
    fireEvent.click(screen.getByText('Create Contest'));
    expect(screen.getByText('Create Contest', { selector: 'header' })).toBeInTheDocument();
  });

  test('creates contest with valid input', async () => {
    render(<ContestCreation addContest={mockAddContest} />);
    fireEvent.click(screen.getByText('Create Contest'));

    fireEvent.change(screen.getByPlaceholderText('Enter contest name'), { target: { value: 'Test Contest' } });
    fireEvent.change(screen.getByLabelText('Start Time'), { target: { value: '2023-05-01T10:00' } });
    fireEvent.change(screen.getByLabelText('End Time'), { target: { value: '2023-05-01T12:00' } });

    fireEvent.click(screen.getByText('Create Contest', { selector: 'button' }));

    await waitFor(() => {
      expect(mockAddContest).toHaveBeenCalledWith({
        name: 'Test Contest',
        startTime: '2023-05-01T10:00:00.000Z',
        endTime: '2023-05-01T12:00:00.000Z',
      });
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Contest created',
      description: 'Contest "Test Contest" created successfully.',
      status: 'success',
      duration: 6000,
    });
  });

  test('shows error toast when form is incomplete', async () => {
    render(<ContestCreation addContest={mockAddContest} />);
    fireEvent.click(screen.getByText('Create Contest'));

    fireEvent.click(screen.getByText('Create Contest', { selector: 'button' }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Missing information',
        description: 'Please fill out all fields to create a contest.',
        status: 'error',
        duration: 6000,
      });
    });

    expect(mockAddContest).not.toHaveBeenCalled();
  });

  test('updates contest name input', () => {
    render(<ContestCreation addContest={mockAddContest} />);
    fireEvent.click(screen.getByText('Create Contest'));
    
    const input = screen.getByPlaceholderText('Enter contest name');
    fireEvent.change(input, { target: { value: 'New Contest' } });
    
    expect(input.value).toBe('New Contest');
  });

  test('updates start time input', () => {
    render(<ContestCreation addContest={mockAddContest} />);
    fireEvent.click(screen.getByText('Create Contest'));
    
    const input = screen.getByLabelText('Start Time');
    fireEvent.change(input, { target: { value: '2023-05-02T14:00' } });
    
    expect(input.value).toBe('2023-05-02T14:00');
  });

  test('updates end time input', () => {
    render(<ContestCreation addContest={mockAddContest} />);
    fireEvent.click(screen.getByText('Create Contest'));
    
    const input = screen.getByLabelText('End Time');
    fireEvent.change(input, { target: { value: '2023-05-02T16:00' } });
    
    expect(input.value).toBe('2023-05-02T16:00');
  });

  test('closes drawer after successful contest creation', async () => {
    render(<ContestCreation addContest={mockAddContest} />);
    fireEvent.click(screen.getByText('Create Contest'));

    fireEvent.change(screen.getByPlaceholderText('Enter contest name'), { target: { value: 'Test Contest' } });
    fireEvent.change(screen.getByLabelText('Start Time'), { target: { value: '2023-05-01T10:00' } });
    fireEvent.change(screen.getByLabelText('End Time'), { target: { value: '2023-05-01T12:00' } });

    fireEvent.click(screen.getByText('Create Contest', { selector: 'button' }));

    await waitFor(() => {
      expect(screen.queryByText('Create Contest', { selector: 'header' })).not.toBeInTheDocument();
    });
  });
});