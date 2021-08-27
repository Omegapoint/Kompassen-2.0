resource "random_uuid" "admin" {}

resource "random_uuid" "worker" {}

resource "azuread_application" "login" {
  display_name = "${var.name}-ad"
  owners       = [data.azuread_client_config.current.object_id]


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
    ]
  }
}

resource "azuread_service_principal" "login" {
  application_id = azuread_application.login.application_id
  tags           = ["WindowsAzureActiveDirectoryIntegratedApp"]
  owners         = [data.azuread_client_config.current.object_id]
}
