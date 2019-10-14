module.exports = {
  pages: [
    {
      id: "hello",
      uri: "/",
      title: "Hello",
      template: "page.pug",
      body:
        "This is a simple website created using Pugger. To get started, start editing the <code>site.js</code> file."
    },
    {
      id: "about",
      uri: "/about",
      title: "About",
      template: "page.pug",
      body: "This page shows an example of loading images from the assets folder. Make sure that all your assets start with the <code>/assets/</code> prefix.",
      attachments: [{ title: "Image", src: "/assets/image-01.jpg" }]
    }
  ]
};
