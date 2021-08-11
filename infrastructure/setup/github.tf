data "github_actions_public_key" "public_key" {
  repository = var.git_repo
}

resource "github_actions_secret" "azure_credentials" {
  repository  = var.git_repo
  secret_name = "AZURE_CREDENTIALS"
  plaintext_value = jsonencode({
    clientId : azuread_application.app.application_id,
    clientSecret : nonsensitive(azuread_application_password.app.value),
    subscriptionId : var.subscription,
    tenantId : data.azuread_client_config.current.tenant_id,
    activeDirectoryEndpointUrl : "https://login.microsoftonline.com",
    resourceManagerEndpointUrl : "https://management.azure.com/",
    activeDirectoryGraphResourceId : "https://graph.windows.net/",
    sqlManagementEndpointUrl : "https://management.core.windows.net:8443/",
    galleryEndpointUrl : "https://gallery.azure.com/",
    managementEndpointUrl : "https://management.core.windows.net/"
  })
}

resource "github_actions_secret" "azure_client_id" {
  repository      = var.git_repo
  secret_name     = "ARM_CLIENT_ID"
  plaintext_value = azuread_application.app.application_id
}

resource "github_actions_secret" "azure_client_secret" {
  repository      = var.git_repo
  secret_name     = "ARM_CLIENT_SECRET"
  plaintext_value = nonsensitive(azuread_application_password.app.value)
}

resource "github_actions_secret" "azure_subscription_id" {
  repository      = var.git_repo
  secret_name     = "ARM_SUBSCRIPTION_ID"
  plaintext_value = var.subscription
}

resource "github_actions_secret" "azure_tenant_id" {
  repository      = var.git_repo
  secret_name     = "ARM_TENANT_ID"
  plaintext_value = data.azuread_client_config.current.tenant_id
}
