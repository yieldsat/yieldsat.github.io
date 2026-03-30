document.addEventListener("DOMContentLoaded", () => {
  setupPlaceholderLinks();
  setupBenchmarkTableWrappers();
});

function setupPlaceholderLinks() {
  const placeholderLinks = document.querySelectorAll("a[data-placeholder='true']");
  const status = document.querySelector(".publication-status");

  placeholderLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      if (!status) {
        return;
      }

      status.scrollIntoView({ behavior: "smooth", block: "center" });
      status.classList.remove("is-highlighted");

      window.requestAnimationFrame(() => {
        status.classList.add("is-highlighted");
      });
    });
  });
}

function setupBenchmarkTableWrappers() {
  const wrappers = document.querySelectorAll(".benchmark-table-wrapper");

  wrappers.forEach((wrapper) => {
    const updateWrapperState = () => {
      const isScrollable = wrapper.scrollWidth > wrapper.clientWidth + 2;
      const isScrolledEnd =
        wrapper.scrollLeft + wrapper.clientWidth >= wrapper.scrollWidth - 2;

      wrapper.classList.toggle("is-scrollable", isScrollable);
      wrapper.classList.toggle("is-scrolled-end", !isScrollable || isScrolledEnd);
    };

    updateWrapperState();
    wrapper.addEventListener("scroll", updateWrapperState, { passive: true });
    window.addEventListener("resize", updateWrapperState);
  });
}
