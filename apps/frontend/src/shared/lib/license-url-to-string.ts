export const licenseUrlToString = (licenseUrl: string): string => {
  // Handle all creative commons, public domain, and other licenses
  if (licenseUrl.includes('creativecommons.org')) {
    const path = new URL(licenseUrl).pathname
    const parts = path.split('/')

    const license = parts.at(2)
    const version = parts.at(3)

    if (!license) {
      return 'CC'
    }

    if (!version) {
      return `CC ${license.toUpperCase()}`
    }

    return `CC ${license.toUpperCase()} ${version}`
  }

  return licenseUrl
}
