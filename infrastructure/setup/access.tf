data "azuread_client_config" "current" {}

resource "azurerm_resource_group" "app" {
  name     = var.name
  location = var.location
}

resource "random_uuid" "admin" {}

resource "random_uuid" "worker" {}

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

  app_role {
    allowed_member_types = ["User"]
    description          = "Admin"
    display_name         = "Admin"
    enabled              = true
    value                = "Admin"
    id                   = random_uuid.admin.result
  }

  app_role {
    allowed_member_types = ["User"]
    description          = "Worker"
    display_name         = "Worker"
    enabled              = true
    value                = "Worker"
    id                   = random_uuid.worker.result
  }


  required_resource_access {
    resource_app_id = "00000003-0000-0000-c000-000000000000"

    resource_access {
      id   = "e1fe6dd8-ba31-4d61-89e7-88639da4683d"
      type = "Scope"
    }

    resource_access {
      id   = "b340eb25-3456-403f-be2f-af7a0d370277"
      type = "Scope"
    }
  }

  single_page_application {
    redirect_uris = [
      "http://localhost:3000/",
      "https://kompassen2.azurewebsites.net/",
      "https://kompass.omegapoint.academy/"
    ]
  }
}

resource "azuread_application_password" "app" {
  application_object_id = azuread_application.app.object_id
}

resource "azuread_service_principal" "app" {
  application_id               = azuread_application.app.application_id
  app_role_assignment_required = false
  tags                         = ["WindowsAzureActiveDirectoryIntegratedApp"]
  owners                       = [data.azuread_client_config.current.object_id]
}

resource "azurerm_role_assignment" "contributor" {
  scope                = "/subscriptions/${var.subscription}/resourceGroups/${azurerm_resource_group.app.name}"
  role_definition_name = "Contributor"
  principal_id         = azuread_service_principal.app.id
}
