const model = require("./model.json");

const replaceEmbedDefinitions = [
  {
    embedRegex: /\[vimeo ([^\]]+)\]/gim,
    videoIdRegex: /\/([0-9]+)\]$/,
    template(videoId) {
      return `<div class="ah-video"><iframe src="https://player.vimeo.com/video/${videoId}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>`;
    }
  },
  {
    embedRegex: /\[youtube ([^\]]+)\]/gim,
    videoIdRegex: /\?v=([0-9a-zA-Z-]+)\]$/,
    template(videoId) {
      return `<div class="ah-video"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>`;
    }
  }
];

function replaceEmbeds(content) {
  if (!content) return content;
  let result = content;
  replaceEmbedDefinitions.forEach(({ embedRegex, videoIdRegex, template }) => {
    const matches = result.match(embedRegex) || [];
    matches.forEach(match => {
      const videoId = videoIdRegex.exec(match)[1].trim();
      result = result.replace(match, template(videoId));
    });
  });
  return result;
}

const pages = [
  ...model.articles,
  ...model.projects,
  ...model.news,
  ...model.teaching
]
  .map(page => {
    page.uri = `/${page.uri}`;
    if (!page.template) {
      page.template =
        page.schema === "teaching" ? "project.pug" : `${page.schema}.pug`;
    }
    page.images.forEach(image => {
      image.src = `/${image.src}`;
    });
    page.published = !!page.published;
    page.body = replaceEmbeds(page.body);
    return page;
  })
  .filter(page => page.published);

module.exports = {
  meta: model.meta,
  pages
};
