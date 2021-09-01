resource "azurerm_app_service_plan" "asp" {
  name                = var.name
  location            = var.location
  resource_group_name = var.name

  kind     = "Linux"
  reserved = true

  sku {
    tier = "Standard"
    size = "S1"
  }
}

resource "azurerm_app_service" "webapp" {
  name                = var.name
  location            = var.location
  resource_group_name = var.name

  app_service_plan_id = azurerm_app_service_plan.asp.id

  site_config {
    linux_fx_version = "DOCKER|kompassen2.azurecr.io/webapp:latest"
  }

  app_settings = {
    DOCKER_REGISTRY_SERVER_URL      = "https://${azurerm_container_registry.acr.login_server}"
    DOCKER_REGISTRY_SERVER_USERNAME = azurerm_container_registry.acr.admin_username
    DOCKER_REGISTRY_SERVER_PASSWORD = azurerm_container_registry.acr.admin_password

    PORT = "8080"
    API_SERVER : "https://${var.name}-server.azurewebsites.net"
  }
}

resource "azurerm_app_service" "server" {
  name                = "${var.name}-server"
  location            = var.location
  resource_group_name = var.name

  app_service_plan_id = azurerm_app_service_plan.asp.id

  site_config {
    linux_fx_version = "DOCKER|kompassen2.azurecr.io/server:latest"
  }

  app_settings = {
    DOCKER_REGISTRY_SERVER_URL      = "https://${azurerm_container_registry.acr.login_server}"
    DOCKER_REGISTRY_SERVER_USERNAME = azurerm_container_registry.acr.admin_username
    DOCKER_REGISTRY_SERVER_PASSWORD = azurerm_container_registry.acr.admin_password

    PORT              = "8080"
    OIDC_CLIENT_ID    = var.client_id
    OIDC_TENANT_ID    = var.tenant_id
    OIDC_REDIRECT_URL = "https://${var.name}.azurewebsites.net"

    PG_USERNAME = "${azurerm_postgresql_server.ps.administrator_login}@${var.name}"
    PG_PASSWORD = azurerm_postgresql_server.ps.administrator_login_password
    PG_HOST     = azurerm_postgresql_server.ps.fqdn
    PG_PORT     = "5432"
    PG_DATABASE = var.name
    PG_SSL      = "1"
  }
}

resource "azurerm_container_registry" "acr" {
  name                = var.name
  resource_group_name = var.name
  location            = var.location
  sku                 = "Basic"
  admin_enabled       = true
}

resource "random_password" "password" {
  length           = 16
  special          = true
  override_special = "_%@"
}

resource "azurerm_postgresql_server" "ps" {
  name                = var.name
  location            = var.location
  resource_group_name = var.name

  administrator_login          = "pgadmin"
  administrator_login_password = random_password.password.result

  sku_name   = "GP_Gen5_2"
  version    = "11"
  storage_mb = 640000

  backup_retention_days        = 7
  geo_redundant_backup_enabled = false
  auto_grow_enabled            = true

  public_network_access_enabled    = true
  ssl_enforcement_enabled          = true
  ssl_minimal_tls_version_enforced = "TLS1_2"
}

resource "azurerm_virtual_network" "vn" {
  name                = var.name
  resource_group_name = var.name
  location            = var.location

  address_space = ["172.17.0.0/16"]
}

resource "azurerm_subnet" "default" {
  name                 = "default"
  resource_group_name  = var.name
  virtual_network_name = azurerm_virtual_network.vn.name
  address_prefixes     = ["172.17.0.0/24"]
  service_endpoints    = ["Microsoft.Sql"]

  delegation {
    name = "Microsoft.Web.serverFarms"
    service_delegation {
      name    = "Microsoft.Web/serverFarms"
      actions = ["Microsoft.Network/virtualNetworks/subnets/action"]
    }
  }
}

resource "azurerm_postgresql_virtual_network_rule" "vnr" {
  name                = var.name
  resource_group_name = var.name
  server_name         = azurerm_postgresql_server.ps.name
  subnet_id           = azurerm_subnet.default.id
}

resource "azurerm_app_service_virtual_network_swift_connection" "vnsc" {
  app_service_id = azurerm_app_service.server.id
  subnet_id      = azurerm_subnet.default.id
}
