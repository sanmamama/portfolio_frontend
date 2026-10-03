import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

export const BlogDataContext = createContext(null);
const apiUrl = process.env.REACT_APP_API_URL;
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
export const BLOG_CACHE_TTL = 30000;

export const BlogDataProvider = ({ children }) => {
    const cache = useRef(new Map());
    const pending = useRef(new Map());
    const load = useCallback((path) => {
        const cached = cache.current.get(path);
        if (cached && Date.now() - cached.time < BLOG_CACHE_TTL) return Promise.resolve(cached.data);
        if (pending.current.has(path)) return pending.current.get(path);
        const params = new URLSearchParams(path.split('?')[1] || '');
        params.set('tz', timezone);
        const request = fetch(`${apiUrl}/${path.split('?')[0]}?${params}`)
            .then(async response => {
                if (!response.ok) {
                    const error = new Error('記事を取得できませんでした。');
                    error.status = response.status;
                    throw error;
                }
                const data = await response.json();
                // Bound memory to visited pages rather than retaining every article.
                if (cache.current.size >= 30) cache.current.delete(cache.current.keys().next().value);
                cache.current.set(path, { data, time: Date.now() });
                return data;
            })
            .finally(() => pending.current.delete(path));
        pending.current.set(path, request);
        return request;
    }, []);
    const updateLikes = useCallback((id, likes) => {
        for (const [key, entry] of cache.current) {
            const resource = entry.data;
            if (String(resource.id) === String(id)) cache.current.set(key, { ...entry, data: { ...resource, likes } });
            if (resource.results) cache.current.set(key, {
                ...entry,
                data: { ...resource,
                results: resource.results.map(article => String(article.id) === String(id) ? { ...article, likes } : article),
                },
            });
        }
    }, []);
    return <BlogDataContext.Provider value={{ load, updateLikes }}>{children}</BlogDataContext.Provider>;
};

export const useBlogResource = (path) => {
    const { load } = useContext(BlogDataContext);
    const [resource, setResource] = useState({ path: null, data: null, error: null });
    useEffect(() => {
        let active = true;
        const refresh = () => load(path).then(data => {
            if (active) setResource({ path, data, error: null });
        }).catch(error => {
            if (active) setResource(previous => previous.path === path && previous.data && error.status !== 404
                ? previous : { path, data: null, error });
        });
        refresh();
        const timer = setInterval(() => {
            if (document.visibilityState !== 'hidden') refresh();
        }, BLOG_CACHE_TTL);
        window.addEventListener('focus', refresh);
        return () => {
            active = false;
            clearInterval(timer);
            window.removeEventListener('focus', refresh);
        };
    }, [load, path]);
    return resource.path === path ? resource : { data: null, error: null };
};
