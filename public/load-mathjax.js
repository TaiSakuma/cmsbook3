// Based on https://docs.mathjax.org/en/latest/web/configuration.html#configuring-and-loading-in-one-script
window.MathJax = {
  tex: {
    // inlineMath: [["$", "$"], ["\(", "\)"]],
    // displayMath: [["$$", "$$"]],
  },
  svg: {
    fontCache: "global",
  },
};

function loadMathJax() {
  var script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js";
//   script.src = "https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-mml-chtml.js";
  script.async = true;
  document.head.appendChild(script);
}

loadMathJax();
