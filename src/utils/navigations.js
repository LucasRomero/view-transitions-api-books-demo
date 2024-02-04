const checkIsNavigationSupported = () => {
  return Boolean(document.startViewTransition);
};

const fetchPage = async (url) => {
  // vamos a cargar la pagina de destino
  // utilizando un fetch para obtener el HTML
  const response = await fetch(url); // => /clean-code
  // obtener el contenido del html
  const text = await response.text();
  // quedarnos solo con el contenido del html dentro de la etiqueta body
  // usamos un regex para obtenerlo
  const match = text.match(/<body[^>]*>([\s\S]*)<\/body>/);
  return match ? match[1] : "";
};

export const startViewTransition = () => {
  if (!checkIsNavigationSupported()) return;
  window.navigation.addEventListener("navigate", (event) => {
    const toUrl = new URL(event.destination.url);
    // es una pagina externa? si es asi, lo ignoramos
    if (location.origin !== toUrl.origin) return;
    // si es una navegacion en el mismo dominio, hacemos lo siguiente:
    event.intercept({
      async handler() {
        const data = await fetchPage(toUrl.pathname);
        // utilizar la api de view transition API
        document.startViewTransition(() => {
          // como tiene que actualizar la vista
          document.body.innerHTML = data;
          // el scroll hacia arriba del todo
          document.documentElement.scrollTop = 0;
        });
      },
    });
  });
};
