import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

export const BlogDataContext = createContext(null);
const apiUrl = process.env.REACT_APP_API_URL;
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const BlogDataProvider = ({ children }) => {
    const cache = useRef(new Map());
    const pending = useRef(new Map());
    const load = useCallback((path) => {
        if (cache.current.has(path)) return Promise.resolve(cache.current.get(path));
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
                cache.current.set(path, data);
                return data;
            })
            .finally(() => pending.current.delete(path));
        pending.current.set(path, request);
        return request;
    }, []);
    const updateLikes = useCallback((id, likes) => {
        for (const [key, resource] of cache.current) {
            if (String(resource.id) === String(id)) cache.current.set(key, { ...resource, likes });
            if (resource.results) cache.current.set(key, {
                ...resource,
                results: resource.results.map(article => String(article.id) === String(id) ? { ...article, likes } : article),
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
        load(path).then(data => {
            if (active) setResource({ path, data, error: null });
        }).catch(error => {
            if (active) setResource({ path, data: null, error });
        });
        return () => { active = false; };
    }, [load, path]);
    return resource.path === path ? resource : { data: null, error: null };
};
