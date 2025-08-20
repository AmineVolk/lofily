import { GetOneGroupDtoWithStats } from '@/Dto/Notes/GetAllGoup.dto';
import { GetUserDto } from '@/Dto/User/GetUser.dto';
import { GetUserMuiscEffect } from '@/Dto/UserMusicEffect/GetUserMusicEffect.dto';

export enum MusicStatus {
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  NOT_SET = 'NOT_SET',
}

export enum MenuItemsIndex {
  NONE = 0,
  MIXTS = 1,
  NOTES = 2,
  STATS = 3,
  PROFILE = 4,
  SETTINGS = 5,
  TIMER = 6,
  SCENES = 7,
  YOUTUBE = 8,
  LOFIMON = 9,
}
export type StoreType = {
  currentMenuIndex: number;
  displayTimer: boolean;
  user: GetUserDto | null;
  timerDuration: number;
  effects: GetUserMuiscEffect[];
  musicStatus: MusicStatus;
  displayPricingDialog: boolean;
  isActive: boolean;
  displayYoutube: boolean;
  currentMusicIndex: null | number;
  freeBackgroundUrl?: string;
  freeBackgroundUrlMobile?: string;
  previousVolume: number;
  noteGroups: GetOneGroupDtoWithStats[];
  currentGroup: GetOneGroupDtoWithStats | null;
};
const Store: StoreType = {
  currentMenuIndex: 0,
  displayTimer: false,
  displayPricingDialog: false,
  user: null,
  timerDuration: 0,
  effects: [],
  musicStatus: MusicStatus.NOT_SET,
  isActive: true,
  displayYoutube: false,
  currentMusicIndex: null,
  freeBackgroundUrl: '',
  freeBackgroundUrlMobile: '',
  previousVolume: 0,
  noteGroups: [],
  currentGroup: null,
};
export { Store };
