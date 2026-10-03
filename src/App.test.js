import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the blog without downloading all article bodies', async () => {
  jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
  global.fetch = jest.fn(url => Promise.resolve({
    ok: true,
    json: async () => url.includes('/summary/')
      ? { categories: [], tags: [], archives: [] }
      : { count: 0, page: 1, page_count: 1, results: [] },
  }));
  render(<App />);
  expect(screen.getByText('さんまの技術ブログ')).toBeInTheDocument();
  expect(await screen.findByText('「」記事が見つかりません')).toBeInTheDocument();
  expect(fetch.mock.calls.some(([url]) => url.includes('/all/'))).toBe(false);
});

afterEach(() => { delete global.fetch; jest.restoreAllMocks(); });
