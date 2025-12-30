
import { Comic, ComicDetail, ChapterData } from '../types';

const BASE_URL = 'https://laravel-api-manga-scraper.vercel.app/api/api';

const extractSlug = (url: string) => {
  if (!url) return '';
  const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  const parts = cleanUrl.split('/');
  // Mengambil bagian terakhir dari URL sebagai slug
  const slug = parts.filter(p => p !== '').pop() || '';
  return slug;
};

const ensureArray = (data: any): any[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'object') {
    if (data.data && data.data.data && Array.isArray(data.data.data)) return data.data.data;
    const commonKeys = ['data', 'manga', 'terbaru', 'berwarna', 'result', 'list', 'cari', 'search'];
    for (const key of commonKeys) {
      if (Array.isArray(data[key])) return data[key];
    }
    const values = Object.values(data);
    for (const val of values) {
      if (Array.isArray(val)) return val;
    }
  }
  return [];
};

const mapComicItem = (item: any): Comic => {
  return {
    title: item.title || item.nama || 'Untitled',
    img: item.img || item.thumb || item.thumbnail || '',
    type: (item.type || 'Manga').trim(),
    chapter: item.chapter || item.latest_chapter || item.type,
    ratting: item.ratting || item.score || null,
    update: item.update || 'Recently',
    jenis: item.jenis || '',
    url: item.url || item.endpoint || '',
    slug: extractSlug(item.url || item.endpoint)
  };
};

export const fetchTypes = async (): Promise<string[]> => {
  try {
    const res = await fetch(`${BASE_URL}/type`);
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching types:", error);
    return ['Manga', 'Manhwa', 'Manhua'];
  }
};

export const fetchGenres = async (): Promise<string[]> => {
  try {
    const res = await fetch(`${BASE_URL}/genre`);
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
};

export const fetchByType = async (type: string, page: number = 1): Promise<{ comics: Comic[], totalPages: number }> => {
  try {
    const res = await fetch(`${BASE_URL}/type/${type.toLowerCase()}/${page}`);
    const json = await res.json();
    const data = json.data;
    if (!data) return { comics: [], totalPages: 1 };
    return {
      comics: ensureArray(data.data).map(mapComicItem),
      totalPages: parseInt(data.total_page) || 1
    };
  } catch (error) {
    console.error(`Error fetching type ${type}:`, error);
    return { comics: [], totalPages: 1 };
  }
};

export const fetchByGenre = async (genre: string, page: number = 1): Promise<{ comics: Comic[], totalPages: number }> => {
  try {
    const res = await fetch(`${BASE_URL}/genre/${genre.toLowerCase()}/${page}`);
    const json = await res.json();
    const data = json.data;
    if (!data) return { comics: [], totalPages: 1 };
    return {
      comics: ensureArray(data.data).map(mapComicItem),
      totalPages: parseInt(data.total_page) || 1
    };
  } catch (error) {
    console.error(`Error fetching genre ${genre}:`, error);
    return { comics: [], totalPages: 1 };
  }
};

export const fetchPopular = async (): Promise<Comic[]> => {
  try {
    const res = await fetch(`${BASE_URL}/popular`);
    const data = await res.json();
    return ensureArray(data).map(mapComicItem);
  } catch (error) {
    console.error("Error fetching popular:", error);
    return [];
  }
};

export const fetchLatest = async (page: number = 1): Promise<Comic[]> => {
  try {
    const res = await fetch(`${BASE_URL}/terbaru/${page}`);
    const data = await res.json();
    return ensureArray(data).map(mapComicItem);
  } catch (error) {
    console.error("Error fetching latest:", error);
    return [];
  }
};

export const fetchColored = async (page: number = 1): Promise<Comic[]> => {
  try {
    const res = await fetch(`${BASE_URL}/berwarna/${page}`);
    const data = await res.json();
    return ensureArray(data).map(mapComicItem);
  } catch (error) {
    console.error("Error fetching colored:", error);
    return [];
  }
};

export const fetchSearch = async (query: string): Promise<Comic[]> => {
  try {
    const res = await fetch(`${BASE_URL}/search/${encodeURIComponent(query)}`);
    const data = await res.json();
    return ensureArray(data).map(mapComicItem);
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
};

export const fetchDetail = async (slug: string): Promise<ComicDetail> => {
  try {
    const res = await fetch(`${BASE_URL}/detail/${slug}`);
    const json = await res.json();
    const data = json.data;

    if (data.chapter) {
      data.chapter = data.chapter.map((ch: any) => ({
        ...ch,
        slug: extractSlug(ch.url || ch.endpoint || '')
      }));
    }

    if (data.mirip) {
      data.mirip = data.mirip.map((m: any) => ({
        ...mapComicItem(m),
        slug: extractSlug(m.url || m.endpoint || '')
      }));
    }

    return data;
  } catch (error) {
    console.error("Error fetching detail:", error);
    throw error;
  }
};

export const fetchChapterImages = async (slug: string): Promise<ChapterData> => {
  try {
    const res = await fetch(`${BASE_URL}/baca/${slug}/`);
    const json = await res.json();
    const rawData = json.data;
    
    // Melakukan mapping data dari API ke format ChapterData internal kita
    return {
      title: rawData.title,
      images: rawData.img || [],
      // Ekstrak slug dari URL navigasi yang diberikan API
      prev_slug: rawData.back_chapter ? extractSlug(rawData.back_chapter) : null,
      next_slug: rawData.next_chapter ? extractSlug(rawData.next_chapter) : null
    };
  } catch (error) {
    console.error("Error fetching chapter images:", error);
    throw error;
  }
};
