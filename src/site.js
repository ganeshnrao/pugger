const pages = [];

pages.push({
  uri: "/",
  title: "Hello",
  template: "page.pug",
  type: "page",
  body: "Hello world"
});

pages.push({
  uri: "/works",
  title: "Works",
  template: "works.pug",
  type: "page",
  body: "Catalog of recent work"
});

pages.push({
  uri: "/works/foobar",
  title: "FooBar",
  type: "work",
  template: "page.pug",
  body: "About project FooBar",
  attachments: [
    { title: "Image 1", src: "/assets/image-01.jpg" },
    { title: "Image 2", src: "/assets/image-02.jpg" },
  ]
});

pages.push({
  uri: "/works/fizzbuzz",
  title: "FizzBuzz",
  type: "work",
  template: "page.pug",
  body: "About project FizzBuzz",
  attachments: [{ title: "Image 2", src: "/assets/image-02.jpg" }]
});

module.exports = {
  pages
};
