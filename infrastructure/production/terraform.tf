resource "azurerm_app_service_plan" "asp" {
  name                = var.name
  location            = var.location
  resource_group_name = var.name

  kind     = "Linux"
  reserved = true

  sku {
    tier = "Basic"
    size = "B1"
  }
}

resource "azurerm_app_service" "webapp" {
  name                = var.name
  location            = var.location
  resource_group_name = var.name

  app_service_plan_id = azurerm_app_service_plan.asp.id
  https_only = true

  site_config {
    linux_fx_version = "DOCKER|kompassen2.azurecr.io/webapp:latest"
    always_on        = true
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
  https_only = true

  site_config {
    linux_fx_version = "DOCKER|kompassen2.azurecr.io/server:latest"
    always_on        = true
  }

  app_settings = {
    DOCKER_REGISTRY_SERVER_URL      = "https://${azurerm_container_registry.acr.login_server}"
    DOCKER_REGISTRY_SERVER_USERNAME = azurerm_container_registry.acr.admin_username
    DOCKER_REGISTRY_SERVER_PASSWORD = azurerm_container_registry.acr.admin_password

    PORT              = "8080"
    OIDC_CLIENT_ID    = var.client_id
    OIDC_TENANT_ID_OP   = var.tenant_id_op
    OIDC_TENANT_ID_IBMB = var.tenant_id_ib_mb
    OIDC_TENANT_ID_ELICIT = var.tenant_id_elicit
    OIDC_REDIRECT_URL = "https://kompass.omegapoint.academy"

    PG_USERNAME = "${azurerm_postgresql_server.ps.administrator_login}@${var.name}"
    PG_PASSWORD = azurerm_postgresql_server.ps.administrator_login_password
    PG_HOST     = azurerm_postgresql_server.ps.fqdn
    PG_PORT     = "5432"
    PG_DATABASE = var.name
    PG_SSL      = "1"

    KV_APP_REGISTRATION_SECRET = "@Microsoft.KeyVault(VaultName=kv-kompassen2;SecretName=kompassen-app-registration-secret)"
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
  length           = 42
  special          = true
  override_special = "_%@"
}

resource "azurerm_postgresql_server" "ps" {
  name                = var.name
  location            = var.location
  resource_group_name = var.name

  administrator_login          = "pgadmin"
  administrator_login_password = random_password.password.result

  sku_name   = "B_Gen5_1"
  version    = "11"
  storage_mb = 8192

  backup_retention_days        = 7
  geo_redundant_backup_enabled = false
  auto_grow_enabled            = true

  public_network_access_enabled    = true
  ssl_enforcement_enabled          = true
  ssl_minimal_tls_version_enforced = "TLS1_2"
}

resource "azurerm_postgresql_firewall_rule" "fr" {
  name                = var.name
  resource_group_name = var.name
  server_name         = azurerm_postgresql_server.ps.name
  start_ip_address    = "0.0.0.0"
  end_ip_address      = "255.255.255.255"
}
