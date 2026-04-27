import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = 'Kshirva - Fresh Organic Produce from Local Farmers',
  description = 'Buy fresh organic produce directly from local farmers. Farm-to-consumer marketplace for vegetables, fruits, dairy, and grains.',
  keywords = 'farm to consumer, organic produce, fresh vegetables, local farmers',
  image = '/og-image.jpg',
  url = 'https://kshirva.com'
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;
