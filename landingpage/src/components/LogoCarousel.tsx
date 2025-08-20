import Image from 'next/image';
import Slider from 'react-infinite-logo-slider';

const LogoCarousel = () => {
  return (
    <div id='logo-slider'>
      <Slider
        width='250px'
        duration={40}
        pauseOnHover={true}
        blurBorders={false}
        blurBoderColor='#fff'
      >
        <Slider.Slide>
          <a
            target='_blank'
            href='https://www.globalbusinesswatch.com/article/650480211-lofily-a-new-free-web-platform-transforms-focus-and-relaxation-with-lofi-music'
          >
            <Image
              src='/images/logo/1.png'
              alt='global business watch logo'
              width={150}
              height={100}
            />
          </a>
        </Slider.Slide>
        <Slider.Slide>
          <a
            target='_blank'
            href='https://www.worldmusicjournal.com/article/650480211-lofily-a-new-free-web-platform-transforms-focus-and-relaxation-with-lofi-music'
          >
            <Image
              src='/images/logo/2.png'
              alt='world music journal logo'
              width={150}
              height={100}
            />
          </a>
        </Slider.Slide>
        <Slider.Slide>
          <a
            target='_blank'
            href='https://www.streamingmusictimes.com/article/650480211-lofily-a-new-free-web-platform-transforms-focus-and-relaxation-with-lofi-music'
          >
            <Image
              src='/images/logo/3.png'
              alt='streaming music times logo'
              width={150}
              height={100}
            />
          </a>
        </Slider.Slide>
        <Slider.Slide>
          <a
            target='_blank'
            href='https://www.fox21news.com/business/press-releases/ein-presswire/650480211/lofily-a-new-free-web-platform-transforms-focus-and-relaxation-with-lofi-music/'
          >
            <Image
              src='/images/logo/4.png'
              alt='fox 21 local news logo'
              width={150}
              height={100}
            />
          </a>
        </Slider.Slide>
        <Slider.Slide>
          <a
            target='_blank'
            href='https://www.globalbusinesswatch.com/article/650480211-lofily-a-new-free-web-platform-transforms-focus-and-relaxation-with-lofi-music'
          >
            <Image
              src='/images/logo/1.png'
              alt='global business watch logo'
              width={150}
              height={100}
            />
          </a>
        </Slider.Slide>
        <Slider.Slide>
          <a
            target='_blank'
            href='https://www.worldmusicjournal.com/article/650480211-lofily-a-new-free-web-platform-transforms-focus-and-relaxation-with-lofi-music'
          >
            <Image
              src='/images/logo/2.png'
              alt='world music journal logo'
              width={150}
              height={100}
            />
          </a>
        </Slider.Slide>
        <Slider.Slide>
          <a
            target='_blank'
            href='https://www.streamingmusictimes.com/article/650480211-lofily-a-new-free-web-platform-transforms-focus-and-relaxation-with-lofi-music'
          >
            <Image
              src='/images/logo/3.png'
              alt='streaming music times logo'
              width={150}
              height={100}
            />
          </a>
        </Slider.Slide>
        <Slider.Slide>
          <a
            target='_blank'
            href='https://www.fox21news.com/business/press-releases/ein-presswire/650480211/lofily-a-new-free-web-platform-transforms-focus-and-relaxation-with-lofi-music/'
          >
            <Image
              src='/images/logo/4.png'
              alt='fox 21 local news logo'
              width={150}
              height={100}
            />
          </a>
        </Slider.Slide>
      </Slider>
    </div>
  );
};
export { LogoCarousel };
