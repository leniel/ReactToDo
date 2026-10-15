import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Footer from './Footer';

afterEach(() => {
    vi.unstubAllGlobals();
});

test('shows the deployed build number and commit details from build metadata', async () => {
    const buildInfo = {
        buildNumber: '20261015.42',
        buildId: '4815162342',
        commit: 'abcdef1234567890abcdef1234567890abcdef12',
    };
    const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => buildInfo,
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<Footer />);

    const badge = await screen.findByLabelText('Deployed build 20261015.42, commit abcdef1234567890abcdef1234567890abcdef12');
    expect(badge).toHaveTextContent('Build 20261015.42 · abcdef1');
    expect(fetchMock).toHaveBeenCalledWith('/buildinfo.json', { cache: 'no-store' });

    await userEvent.hover(badge);
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent('Build ID: 4815162342');
    expect(tooltip).toHaveTextContent('Commit: abcdef1234567890abcdef1234567890abcdef12');
});

test('hides the build badge when deployment metadata is unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

    render(<Footer />);

    expect(await screen.findByText('React To Do sample ReactJS application.')).toBeInTheDocument();
    expect(screen.queryByLabelText(/Deployed build/)).not.toBeInTheDocument();
});
