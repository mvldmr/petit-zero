const Router = {
  getBreakpoint: () => {
    const params = new URLSearchParams(document.location.search);
    return Number(params.get("resolution"));
  },
  init: () => {
    window.addEventListener("breakpoints:set-current-resolution", (event) => {
      const resolution = event.detail;
      const currentBreakpoint = Router.getBreakpoint();
      if (resolution !== currentBreakpoint) Router.go(resolution, true, false);
    });

    window.addEventListener("popstate", () => {
      const resolution = Router.getBreakpoint();
      Router.go(resolution, false);
    });

    Router.go(Router.getBreakpoint() || window.tn.store.getCurrentResolution());
  },
  go: (resolution, addToHistory = true, needRender = true) => {
    if (addToHistory) {
      let routeURL = resolution && `?resolution=${resolution}`;
      if (!routeURL) routeURL = document.location.pathname;
      history.pushState({}, "", routeURL);
    }

    if (needRender) window.tn.store.changeResolution(resolution);
    window.scroll(5255, 4668);
  },
};

export default Router;
