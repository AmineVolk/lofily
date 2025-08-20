/* eslint-disable @typescript-eslint/no-var-requires */
import { existsSync, mkdirSync, unlink } from 'fs';
import {
  BACKGROUND_FOLDER_PATH,
  EFFECT_FOLDER_PATH,
} from 'src/constants/constants';
const thumbler = require('video-thumb');

export class Helper {
  // the name has to be changed so that it'll be unique
  static customFileName(req, file, cb) {
    console.log('custom file name', file);
    const destExists = existsSync(BACKGROUND_FOLDER_PATH);
    console.log('destExists : ', destExists);
    !destExists ? mkdirSync(BACKGROUND_FOLDER_PATH, { recursive: true }) : '';

    const isMobileVideo = req.query.background_id;
    const mobileSuffix = isMobileVideo ? '-mobile' : '';
    const filename = `${
      req.query.category_id + mobileSuffix + '-' + file.originalname
    }`;

    cb(null, filename);
  }

  static destinationPath(req, file, cb) {
    cb(null, BACKGROUND_FOLDER_PATH);
  }

  static destinationPathEffects(req, file, cb) {
    cb(null, EFFECT_FOLDER_PATH);
  }
  static customFileNameEffect(req, file, cb) {
    console.log('custom file name', file);
    const destExists = existsSync(EFFECT_FOLDER_PATH);
    console.log('destExists : ', destExists);
    !destExists ? mkdirSync(EFFECT_FOLDER_PATH, { recursive: true }) : '';

    cb(null, `${req.query.name + '-' + file.originalname}`);
  }
  static deleteFiles(paths) {
    paths.forEach((path) => {
      const publicPath = 'public/' + path;
      unlink(publicPath, function (err) {
        if (err) {
          console.log('File not deleted : ', { path: publicPath, err });
        } else {
          console.log('File deleted! ', { path: publicPath });
        }
      });
    });
  }
}

function secondsToDateTime(secs) {
  const t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(secs);
  return t;
}

function getPercentageChange(newNumber, oldNumber) {
  if (oldNumber === 0) return newNumber * 100;
  const diff = newNumber - oldNumber;
  return (diff / oldNumber) * 100;
}

const createThumbnail = (
  videoPath: string,
  thumbnailDest: string,
  size?: string,
  time?: string,
) => {
  console.log('---------- createThumbnail ', { videoPath, thumbnailDest });
  return new Promise((resovle, reject) => {
    const timeValue = time || '00:00:2';
    const sizeValue = size || '300x170';
    try {
      return thumbler.extract(
        JSON.stringify(videoPath),
        JSON.stringify(thumbnailDest),
        timeValue,
        sizeValue,
        function () {
          console.log('---------- createThumbnail success to ', {
            videoPath,
            thumbnailDest,
          });
          resovle(true);
        },
      );
    } catch (e) {
      reject(e);
    }
  });
};

const getCurrentFormatedDate = (d = new Date()) => {
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

function shuffleArray(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export {
  secondsToDateTime,
  getPercentageChange,
  createThumbnail,
  getCurrentFormatedDate,
  shuffleArray,
};
