module.exports = {
  pages: [
    {
      id: "hello",
      uri: "/",
      title: "Hello",
      template: "page.pug",
      type: "page",
      body: "Hello world"
    },
    {
      id: "works",
      uri: "/works",
      title: "Works",
      template: "works.pug",
      type: "page",
      body: "Catalog of recent work"
    },
    {
      id: "foobar",
      uri: "/works/foobar",
      title: "FooBar",
      type: "work",
      template: "page.pug",
      body: "About project FooBar",
      attachments: [
        { title: "Image 1", src: "/assets/image-01.jpg" },
        { title: "Image 2", src: "/assets/image-02.jpg" }
      ]
    },
    {
      id: "fizzbuzz",
      uri: "/works/fizzbuzz",
      title: "FizzBuzz",
      type: "work",
      template: "page.pug",
      body: "About project FizzBuzz",
      attachments: [{ title: "Image 2", src: "/assets/image-02.jpg" }]
    }
  ]
};
