import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';

import { Trans } from 'react-i18next';

const url = 'https://lofily.com';
const buttonStyle = { marginRight: 15, marginBottom: 15 };

const Share = () => {
  return (
    <div className='w-full rounded-xl bg-primary-light p-6'>
      <h2 className='mb-2'>
        <Trans i18nKey='setting.share.title' />
      </h2>
      <div className='pt-4'>
        <FacebookShareButton
          url={url}
          quote='Dummy text!'
          hashtag='#lofily.com'
          style={buttonStyle}
        >
          <FacebookIcon size={32} round />
        </FacebookShareButton>

        <LinkedinShareButton url={url} style={buttonStyle}>
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>

        <RedditShareButton url={url} style={buttonStyle}>
          <RedditIcon size={32} round />
        </RedditShareButton>

        <TelegramShareButton url={url} style={buttonStyle}>
          <TelegramIcon size={32} round />
        </TelegramShareButton>

        <TwitterShareButton url={url} style={buttonStyle}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>

        <WhatsappShareButton url={url} style={buttonStyle}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </div>
    </div>
  );
};
export { Share };
