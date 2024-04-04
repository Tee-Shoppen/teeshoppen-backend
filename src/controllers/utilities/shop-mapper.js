const country = {
  noodlefirm: 'Denmark',
  'teeshoppen-cz': 'Czech Republic',
  teeshoppengermany: 'Germany',
  'teeshoppen-finland': 'Finland',
  'teeshoppen-nl': 'Netherlands',
  'teeshoppen-norway': 'Norway',
  'teeshoppen-pl': 'Poland',
  'teeshoppen-sweden': 'Sweden',
  'teeshoppen-uk': 'United Kingdom',
  'teeshoppen-com': 'United States',
  'test-teeshoppen': 'Test Country',
  'femalefashionstore-dk': 'Denmark',
}

const language = {
  noodlefirm: 'Danish',
  'teeshoppen-cz': 'Czech',
  teeshoppengermany: 'German',
  'teeshoppen-finland': 'Finnish',
  'teeshoppen-nl': 'Dutch',
  'teeshoppen-norway': 'Norwegian',
  'teeshoppen-pl': 'Polish',
  'teeshoppen-sweden': 'Swedish',
  'teeshoppen-uk': 'England English',
  'teeshoppen-com': 'American English',
  'test-teeshoppen': 'English',
  'femalefashionstore-dk': 'Danish',
}

const subDomainMap = (subDomain) => {
  return {
    name: subDomain,
    country: country[subDomain],
    language: language[subDomain],
    apiKey: `SHOPIFY_API_${subDomain.replace('-', '').toUpperCase()}`,
    verificationToken: `SHOPIFY_VERIFICATION_${subDomain.replace('-', '').toUpperCase()}`,
  }
}

const domainToSubDomain = (domain) => domain.replace('.myshopify.com', '')

export { subDomainMap, domainToSubDomain }
