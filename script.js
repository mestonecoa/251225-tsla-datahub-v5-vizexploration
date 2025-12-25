(async () => {
  const list = document.getElementById("file-list");
  list.innerHTML = "<li>Scanning directory...</li>";

  const candidates = [
    "./",                  // normal directory request
    "/",                   // root directory
    "./?dir",              // query param trick #1
    "/?dir",               // query param trick #2
    "./index.html",        // fallback: fetch self and parse parent links (rare)
  ];

  let directoryHtml = null;

  for (const url of candidates) {
    try {
      const res = await fetch(url, { cache: "no-store" });

      if (!res.ok) continue;

      const text = await res.text();

      // Quick heuristic: real directory listings usually contain multiple <a href="..." or "Index of"
      if (text.includes("<a href") && (text.includes("Index of") || text.match(/<a href=["'][^"']*\.html["']/gi)?.length > 2)) {
        directoryHtml = text;
        break;
      }
    } catch (e) {
      // silently try next
    }
  }

  if (!directoryHtml) {
    list.innerHTML = "<li>Auto-detection failed.<br><small>This feature only works on local dev servers with directory listing enabled.</small></li>";
    return;
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(directoryHtml, "text/html");

    let links = [...doc.querySelectorAll("a[href]")]
      .map(a => a.getAttribute("href"))
      .map(href => {
        // Clean up href: remove query/hash, resolve ./ and ../
        let clean = href.split("?")[0].split("#")[0];
        if (clean.startsWith("./")) clean = clean.slice(2);
        if (clean === "../") return null;
        return clean;
      })
      .filter(Boolean)
      .filter(href => href.endsWith(".html"))
      .filter(href => href !== "index.html");

    // Dedupe just in case
    links = [...new Set(links)];

    if (links.length === 0) {
      list.innerHTML = "<li>No other .html files found</li>";
      return;
    }

    // Sort nicely
    links.sort();

    list.innerHTML = "";

    links.forEach(file => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = file;
      a.textContent = file;
      li.appendChild(a);
      list.appendChild(li);
    });

  } catch (e) {
    console.error(e);
    list.innerHTML = "<li>Failed to parse directory listing</li>";
  }
})();