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
  'itsmay-markets' : 'United States',
  'engros-teeshoppen': 'Denmark',
  'teeshoppen-group' : 'United States'
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
  'engros-teeshoppen' : 'Danish',
  'itsmay-markets' : 'English',
  'teeshoppen-group' : 'English'
}

const storeName = {
  noodlefirm: 'Teeshoppen - Denmark',
  'teeshoppen-cz': 'Teeshoppen - Czech Republic',
  teeshoppengermany: 'Teeshoppen - Germany',
  'teeshoppen-finland': 'Teeshoppen - Finland',
  'teeshoppen-nl': 'Teeshoppen - Netherlands',
  'teeshoppen-norway': 'Teeshoppen - Norway',
  'teeshoppen-pl': 'Teeshoppen - Poland',
  'teeshoppen-sweden': 'Teeshoppen - Sweden',
  'teeshoppen-uk': 'Teeshoppen - United Kingdom',
  'teeshoppen-com': 'Teeshoppen - United States',
  'test-teeshoppen': 'Teeshoppen - Test Country',
  'femalefashionstore-dk': 'Itsmay - Denmark',
  'itsmay-markets' : 'Itsmay - United States',
  'engros-teeshoppen' : 'Teeshoppen - Engros',
  'teeshoppen-group' : 'Teeshoppen - Group',
}

const subDomainMap = (subDomain) => {
  return {
    name: subDomain,
    storeName: storeName[subDomain],
    country: country[subDomain],
    language: language[subDomain],
    apiKey: `SHOPIFY_API_${subDomain.replace('-', '').toUpperCase()}`,
    verificationToken: `SHOPIFY_VERIFICATION_${subDomain.replace('-', '').toUpperCase()}`,
  }
}

const domainToSubDomain = (domain) => domain.replace('.myshopify.com', '')

export { subDomainMap, domainToSubDomain }
