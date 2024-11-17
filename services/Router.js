const Router = {
  listOfSections: [],
  processSearchURL: (searchLine) => {
    return searchLine.replace("?=", "");
  },
  init: () => {
    const routes = Array.from(document.querySelectorAll(".js-router"));
    routes.forEach((routeLink) => {
      routeLink.addEventListener("click", (e) => {
        e.preventDefault();
        const href = e.target.getAttribute("href")?.replace("/", "") || "";
        Router.go(href);
      });
    });

    window.addEventListener("popstate", () => {
      Router.go(Router.processSearchURL(document.location.search), false);
    });

    Router.go(Router.processSearchURL(document.location.search), false);
  },
  go: (route, addToHistory = true) => {
    if (addToHistory) {
      const routeURL = route ? `?=${route}` : document.location.pathname;
      history.pushState({}, "", routeURL);
    }

    if (route) {
      const currentSection = document.querySelector(
        `[data-section-name="${route}"]`
      );
      if (currentSection) {
        currentSection.classList.remove("disabled");
        Router.listOfSections.push(currentSection);
      }
    } else {
      Router.listOfSections.forEach((section) => {
        section.classList.add("disabled");
      });
      Router.listOfSections = [];
      window.scroll(5255, 4668);
    }
  },
};

export default Router;
