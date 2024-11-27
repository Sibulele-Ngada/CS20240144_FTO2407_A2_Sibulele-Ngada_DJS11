export type Show = {
  description: string;
  genres: number[];
  id: string;
  image: string;
  seasons: Season[];
  title: string;
  updated: string;
};

export type Season = {
  episodes: Episode[];
  image: string;
  season: number;
  title: string;
};

export type Episode = {
  description: string;
  episode: number;
  file: string;
  title: string;
};

export type Fav = {
  showID: string | undefined;
  season: number;
  episode: number;
  favID: string;
  dateFaved: Date;
};

export type Preview = {
  description: string;
  genres: number[];
  id: string;
  image: string;
  seasons: number;
  title: string;
  updated: string;
};
