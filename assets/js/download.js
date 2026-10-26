(function (global) {
  'use strict';

  var API_URL = 'https://api.github.com/repos/Pauz121/GymManager_relase/releases/latest';
  var RELEASES_URL = 'https://github.com/Pauz121/GymManager_relase/releases/latest';

  function installerScore(asset) {
    var name = String(asset && asset.name || '').toLowerCase();
    if (!name || name.endsWith('.sig') || name.endsWith('.json') || name.includes('latest') || name.includes('updater')) return -1;
    if (name.endsWith('.exe') && (name.includes('setup') || name.includes('install'))) return 100;
    if (name.endsWith('.msi')) return 80;
    if (name.endsWith('.exe')) return 60;
    return -1;
  }

  function selectWindowsInstaller(assets) {
    return (Array.isArray(assets) ? assets : [])
      .map(function (asset) { return { asset: asset, score: installerScore(asset) }; })
      .filter(function (item) { return item.score >= 0 && item.asset.browser_download_url; })
      .sort(function (a, b) { return b.score - a.score; })[0]?.asset || null;
  }

  function normalizeVersion(tag) {
    return String(tag || '').replace(/^desktop-v/i, '').replace(/^v/i, '') || '—';
  }

  function formatDate(value) {
    if (!value) return '—';
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('it-IT', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
  }

  function parseStableRelease(release) {
    if (!release || release.draft || release.prerelease) throw new Error('La release restituita non è stabile.');
    var installer = selectWindowsInstaller(release.assets);
    if (!installer) throw new Error('Installer Windows non trovato nella release stabile.');
    return {
      version: normalizeVersion(release.tag_name),
      date: formatDate(release.published_at || release.created_at),
      downloadUrl: installer.browser_download_url,
      assetName: installer.name,
      releaseUrl: release.html_url || RELEASES_URL
    };
  }

  function updatePage(data) {
    document.querySelectorAll('[data-release-version]').forEach(function (node) { node.textContent = data.version; });
    document.querySelectorAll('[data-release-date]').forEach(function (node) { node.textContent = data.date; });
    document.querySelectorAll('[data-release-asset]').forEach(function (node) { node.textContent = data.assetName; });
    document.querySelectorAll('[data-download-link]').forEach(function (link) {
      link.href = data.downloadUrl;
      link.removeAttribute('aria-disabled');
      link.removeAttribute('data-loading');
    });
    document.querySelectorAll('[data-release-status]').forEach(function (node) { node.textContent = 'Ultima release stabile verificata'; });
  }

  function showFallback() {
    document.querySelectorAll('[data-release-version]').forEach(function (node) { node.textContent = 'da verificare'; });
    document.querySelectorAll('[data-download-link]').forEach(function (link) {
      link.removeAttribute('href');
      link.setAttribute('aria-disabled', 'true');
      link.removeAttribute('data-loading');
    });
    document.querySelectorAll('[data-release-status]').forEach(function (node) { node.textContent = 'Download temporaneamente non disponibile'; });
    document.querySelectorAll('[data-release-fallback]').forEach(function (node) {
      node.hidden = false;
      var fallbackLink = node.querySelector('a');
      if (fallbackLink) fallbackLink.href = RELEASES_URL;
    });
  }

  async function loadLatestRelease(fetcher) {
    var controller = new AbortController();
    var timeout = setTimeout(function () { controller.abort(); }, 10000);
    try {
      var response = await (fetcher || global.fetch)(API_URL, {
        headers: { Accept: 'application/vnd.github+json' },
        cache: 'no-store',
        signal: controller.signal
      });
      if (!response.ok) throw new Error('GitHub Releases API: HTTP ' + response.status);
      return parseStableRelease(await response.json());
    } finally { clearTimeout(timeout); }
  }

  global.GymManagerRelease = {
    API_URL: API_URL,
    RELEASES_URL: RELEASES_URL,
    installerScore: installerScore,
    selectWindowsInstaller: selectWindowsInstaller,
    normalizeVersion: normalizeVersion,
    parseStableRelease: parseStableRelease,
    loadLatestRelease: loadLatestRelease
  };

  if (typeof document !== 'undefined' && document.querySelector('[data-download-link], [data-release-version]')) {
    loadLatestRelease().then(updatePage).catch(showFallback);
  }
}(typeof window !== 'undefined' ? window : globalThis));
