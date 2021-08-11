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
