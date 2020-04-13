/** @format */

export type SongID = string | number;

export type Song = {
  ID: SongID;
  URL: string;
  Search: string;
  RequestedBy: string;
  Length: string;
  Name: string;
  Thumbnail: string;
  Channel: string;
  Playing: boolean;
};

export type QueueItem = {
  Name: string;
  Length: string;
  ID: SongID;
};
