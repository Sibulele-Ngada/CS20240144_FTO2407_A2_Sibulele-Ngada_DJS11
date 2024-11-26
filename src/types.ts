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
