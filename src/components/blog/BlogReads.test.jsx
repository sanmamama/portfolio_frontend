import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import BlogDetail from './BlogDetail';
import Header from './Header';
import { BlogDataProvider } from './providers/BlogDataProvider';

const article = {
    id: 1, title: '記事タイトル', img: '/image.png', thumbnail: '',
    category: { id: 1, name: 'Python' }, tag: [{ id: 1, name: 'React' }],
    created_at: '2025-01-01T00:00:00Z', likes: 2, excerpt: '一覧の抜粋',
};
const summary = {
    categories: [['1', { name: 'Python', count: 13 }]],
    tags: [['1', { name: 'React', count: 13 }]], archives: [['202501', 13]],
};
const response = data => Promise.resolve({ ok: true, json: async () => data });

beforeEach(() => {
    global.fetch = jest.fn((url, options) => {
        const parsed = new URL(url, 'http://localhost');
        if (parsed.pathname.endsWith('/summary/')) return response(summary);
        if (options?.method === 'PATCH') return response({ likes: 3 });
        if (parsed.pathname.endsWith('/1/')) return response({
            ...article, content_html: '<p>詳細の本文</p>', toc_html: '',
            previous_article: null, next_article: { id: 2, title: '次の記事' },
            related_posts: [{ ...article, id: 3, title: '関連する記事' }],
        });
        const page = Number(parsed.searchParams.get('page') || 1);
        return response({ count: 13, page, page_count: 2, results: [{ ...article, id: page, title: `ページ${page}の記事` }] });
    });
});
afterEach(() => { delete global.fetch; });

const mount = path => render(
    <MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <BlogDataProvider>
            <Link to="/">一覧へ</Link>
            <Routes><Route path="/" element={<Home />} /><Route path="/blog/:id" element={<BlogDetail />} /></Routes>
        </BlogDataProvider>
    </MemoryRouter>
);

test('一覧はページ単位で取得し、検索条件と全公開記事の件数を保つ', async () => {
    mount('/?q=Python');
    expect(await screen.findByText('ページ1の記事')).toBeInTheDocument();
    expect(screen.getByText('一覧の抜粋')).toBeInTheDocument();
    expect(await screen.findByText('Python (13)')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('link', { name: 'Next' }));
    expect(await screen.findByText('ページ2の記事')).toBeInTheDocument();
    expect(fetch.mock.calls.some(([url]) => url.includes('q=Python') && url.includes('page=2'))).toBe(true);
    expect(fetch.mock.calls.some(([url]) => url.includes('/all/'))).toBe(false);
    expect(fetch.mock.calls.filter(([url]) => url.includes('/summary/'))).toHaveLength(1);
});

test('詳細URLの直接アクセスで本文、前後の記事、関連記事、いいねを表示する', async () => {
    mount('/blog/1');
    expect(await screen.findByText('詳細の本文')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /次の記事/ })).toHaveAttribute('href', '/blog/2');
    expect(screen.getByRole('link', { name: '関連する記事' })).toHaveAttribute('href', '/blog/3');
    fireEvent.click(screen.getByRole('button', { name: 'いいね！ (2)' }));
    expect(await screen.findByRole('button', { name: 'いいね！ (3)' })).toBeInTheDocument();
    expect(fetch.mock.calls.some(([url]) => url.includes('/all/'))).toBe(false);
});

test('一覧に戻るとキャッシュのいいね数も更新されている', async () => {
    mount('/');
    fireEvent.click(await screen.findByRole('link', { name: 'ページ1の記事' }));
    fireEvent.click(await screen.findByRole('button', { name: 'いいね！ (2)' }));
    await screen.findByRole('button', { name: 'いいね！ (3)' });
    fireEvent.click(screen.getByRole('link', { name: '一覧へ' }));
    await screen.findByText('ページ1の記事');
    expect(screen.getByText('3')).toBeInTheDocument();
});

test('存在しない記事は既存の404表示になる', async () => {
    fetch.mockImplementation(() => Promise.resolve({ ok: false, status: 404 }));
    mount('/blog/999');
    expect(await screen.findByText('指定したページが見つかりませんでした')).toBeInTheDocument();
});

test('通信障害は記事が存在しない状態と区別する', async () => {
    fetch.mockRejectedValue(new Error('offline'));
    mount('/blog/1');
    expect(await screen.findByRole('alert')).toHaveTextContent('記事を取得できませんでした。');
    expect(screen.queryByText('指定したページが見つかりませんでした')).not.toBeInTheDocument();
});

test('プロフィールなどのHeader表示では記事を取得しない', async () => {
    render(<MemoryRouter><Header /></MemoryRouter>);
    await waitFor(() => expect(screen.getByText('さんまの技術ブログ')).toBeInTheDocument());
    expect(fetch).not.toHaveBeenCalled();
});
