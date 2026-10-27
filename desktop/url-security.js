function isAllowedExternalUrl(candidate) {
  if (typeof candidate !== 'string') {
    return false;
  }

  try {
    const url = new URL(candidate);
    return (
      (url.protocol === 'https:' || url.protocol === 'http:') &&
      Boolean(url.hostname) &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

module.exports = { isAllowedExternalUrl };
