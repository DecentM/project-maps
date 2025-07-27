export const licenseUrlToString = (licenseUrl: string): string => {
  // Handle all creative commons, public domain, and other licenses
  if (licenseUrl.includes('creativecommons.org')) {
    const path = new URL(licenseUrl).pathname
    const [, , license, version] = path.split('/')

    return `CC ${license.toUpperCase()} ${version}`
  }

  return licenseUrl
}
