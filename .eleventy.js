module.exports = function(eleventyConfig) {
  // Copy files
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/myface.jpg");
  eleventyConfig.addPassthroughCopy("RESUME_EN.pdf");
  eleventyConfig.addPassthroughCopy("RESUME_NL.pdf");
  eleventyConfig.addPassthroughCopy({ ".well-known": ".well-known" });
  
  // Copy _headers file to output if it exists
  eleventyConfig.addPassthroughCopy("src/_headers");
  
  // Copy the CV PDF file from the root to the output
  eleventyConfig.addPassthroughCopy({ "RESUME_NL.pdf": "RESUME_NL.pdf" });
  
  // Add filter for current year
  eleventyConfig.addFilter("currentYear", () => {
    return new Date().getFullYear();
  });
  
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    },
    templateFormats: ["html", "njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
}; 