import Head from 'next/head';

const SEO = () => {
  const seo = {
    siteMetadata: {
      title: 'Lofily.com - Your ultimate Lofi music haven',
      description:
        'Lofily.com is a cutting-edge productivity tool designed to enhance focus, creativity, and relaxation.',
      author: `Lofily`,
      url: 'https://lofily.com/',
      siteUrl: 'https://lofily.com/',
      twitterAuthor: '',
      linkedinAuthor: '',
      facbookAuthor: '',
      myImage: 'lofily.com/favicon/android-chrome-192x192.png',
    },
  };
  const {
    siteMetadata: {
      author,
      description,
      title,
      myImage,
      siteUrl,
      twitterAuthor,
      url,
    },
  } = seo;
  return (
    <Head>
      <title>{title}</title>
      <link rel='canonical' href='https://lofily.com/' />

      <meta name='description' content={description} key='desc' />
      <meta name='url' content={url} />
      <meta name='author' content={author} />
      <meta name='title' property='og:title' content={title} />
      <meta
        name='description'
        property='og:description'
        content={description}
      />
      <meta
        name='image'
        property='og:image:secure'
        content={`https://${myImage}`}
      />
      <meta name='image' property='og:image' content={`http://${myImage}`} />
      <meta
        name='image'
        property='og:image:url'
        content={`http://${myImage}`}
      />
      <meta name='image' property='og:image:type' content='image/jpg' />

      <meta property='og:url' content={siteUrl} />
      <meta property='og:image' content={`https://${myImage}`} />

      <meta property='og:type' content='website' />

      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:image' content={`https://${myImage}`} />
      <meta name='twitter:creator' content={twitterAuthor} />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:text:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:creator' content={twitterAuthor} />
      <meta name='twitter:site' content={url} />
    </Head>
  );
};
export { SEO };
