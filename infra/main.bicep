// Azure Static Web App (Free plan) for the blog.
//
// Deploy:
//   az group create --name rg-blog --location eastus2
//   az deployment group create --resource-group rg-blog --template-file infra/main.bicep
//
// Content is deployed by GitHub Actions with a deployment token, so this
// template doesn't link the repo. See README.md for the token step.

@description('Name of the Static Web App.')
param name string = 'swa-josh-blog'

@description('Region for the resource metadata. Content is served from a global CDN either way.')
@allowed([
  'centralus'
  'eastus2'
  'westus2'
  'westeurope'
  'eastasia'
])
param location string = 'eastus2'

@description('Optional custom domain, such as blog.example.com. Create its CNAME record first, pointing at the default hostname.')
param customDomain string = 'joshgarverick.dev'

param tags object = {
  workload: 'blog'
}

resource site 'Microsoft.Web/staticSites@2024-04-01' = {
  name: name
  location: location
  tags: tags
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    allowConfigFileUpdates: true
    stagingEnvironmentPolicy: 'Enabled'
  }
}

resource domain 'Microsoft.Web/staticSites/customDomains@2024-04-01' = if (!empty(customDomain)) {
  parent: site
  name: empty(customDomain) ? 'placeholder.invalid' : customDomain
  properties: {}
}

output name string = site.name
output defaultHostname string = site.properties.defaultHostname
