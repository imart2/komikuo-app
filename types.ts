
export interface Comic {
  title: string;
  ratting: string | null;
  jenis: string;
  type: string;
  chapter: string;
  update: string;
  img: string;
  url: string;
  slug?: string;
  subtitle?: string;
}

export interface ComicDetail {
  title: string;
  img: string;
  ratting: string;
  short_sinopsis: string;
  status: string;
  judul_alternatif: string;
  pengarang: string;
  ilustrator: string;
  grafis: string;
  jenis_komik: string;
  tema: string[];
  informasi: { title: string; img: string }[];
  official: { title: string; img: string }[];
  chapter: {
    url: string;
    chapter: string;
    update: string;
    slug?: string;
  }[];
  spoiler: string[];
  mirip: Comic[];
}

export interface ChapterData {
  title: string;
  images: string[];
  prev_slug: string | null;
  next_slug: string | null;
}

export interface Notification {
  id: string;
  message: string;
  time: string;
  type: 'favorite' | 'info';
}
