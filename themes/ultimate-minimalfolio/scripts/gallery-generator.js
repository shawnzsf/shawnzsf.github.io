const pagination = require('hexo-pagination');

hexo.extend.generator.register('gallery', function(locals) {
  const config = this.config;
  // Find the source page
  const galleryPage = locals.pages.find(p => p.layout === 'gallery');

  if (!galleryPage || !galleryPage.photos) {
    return;
  }

  const perPage = config.gallery_generator?.per_page || 10;
  const paginationDir = config.pagination_dir || 'page';
  const path = galleryPage.path.replace('index.html', '');

  // We return the pagination utility
  return pagination(path, galleryPage.photos, {
    perPage: perPage,
    layout: ['gallery'],
    format: paginationDir + '/%d/',
    data: {
      title: galleryPage.title,
      content: galleryPage.content,
      // We pass the "total" photos list just in case, 
      // but hexo-pagination puts the CURRENT page's photos into "posts"
    }
  });
});