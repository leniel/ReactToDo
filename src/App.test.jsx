import { render, screen } from '@testing-library/react';
import Home from './components/Home';

test('renders the application home page', () => {
    render(<Home />);

    expect(screen.getByRole('heading')).toBeInTheDocument();
});
