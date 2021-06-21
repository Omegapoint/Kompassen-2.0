data "azuread_client_config" "current" {}

resource "azurerm_resource_group" "app" {
  name     = var.name
  location = var.location
}

resource "azuread_application" "app" {
  display_name = var.name
  owners       = [data.azuread_client_config.current.object_id]

  api {
    oauth2_permission_scope {
      admin_consent_description  = "Allow the application to access ${var.name} on behalf of the signed-in user."
      admin_consent_display_name = "Access ${var.name}"
      enabled                    = true
      id                         = "3d67378d-39ac-1e2b-d7fa-e2622d0d2512"
      type                       = "User"
      user_consent_description   = "Allow the application to access ${var.name} on your behalf."
      user_consent_display_name  = "Access ${var.name}"
      value                      = "user_impersonation"
    }
  }
}

resource "azuread_application_password" "app" {
  application_object_id = azuread_application.app.object_id
}

resource "azuread_service_principal" "app" {
  application_id               = azuread_application.app.application_id
  app_role_assignment_required = false
}

resource "azurerm_role_assignment" "contributor" {
  scope                = "/subscriptions/${var.subscription}/resourceGroups/${azurerm_resource_group.app.name}"
  role_definition_name = "Contributor"
  principal_id         = azuread_service_principal.app.id
}

resource "azurerm_storage_account" "app" {
  name                     = var.name
  resource_group_name      = azurerm_resource_group.app.name
  location                 = azurerm_resource_group.app.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "app" {
  name                  = "tfstate"
  storage_account_name  = azurerm_storage_account.app.name
  container_access_type = "private"
}

resource "azurerm_storage_blob" "app" {
  name                   = "terraform.tfstate"
  storage_account_name   = azurerm_storage_account.app.name
  storage_container_name = azurerm_storage_container.app.name
  content_type           = "application/json"
  access_tier            = "Hot"
  type                   = "Block"
}

resource "local_file" "secrets" {
  sensitive_content = <<EOF
#!/bin/bash

export ARM_CLIENT_ID='${azuread_application.app.application_id}'
export ARM_CLIENT_SECRET='${nonsensitive(azuread_application_password.app.value)}'
export ARM_SUBSCRIPTION_ID='${var.subscription}'
export ARM_TENANT_ID='${data.azuread_client_config.current.tenant_id}'
EOF
  filename          = "../production/secrets.sh"
}

data "github_actions_public_key" "public_key" {
  repository = var.git_repo
}

resource "github_actions_secret" "azure_credentials" {
  repository      = var.git_repo
  secret_name     = "AZURE_CREDENTIALS"
  plaintext_value = <<EOF
{
  "clientId": "${azuread_application.app.application_id}",
  "clientSecret": "${nonsensitive(azuread_application_password.app.value)}",
  "subscriptionId": "${var.subscription}",
  "tenantId": "${data.azuread_client_config.current.tenant_id}",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
EOF
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

output "secret" {
  value = nonsensitive(github_actions_secret.azure_credentials.plaintext_value)
}
