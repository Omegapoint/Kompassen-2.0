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

resource "azurerm_app_service" "as" {
  name                = var.name
  location            = var.location
  resource_group_name = azurerm_app_service_plan.asp.name

  app_service_plan_id = azurerm_app_service_plan.asp.id

  site_config {
    linux_fx_version = "NODE|14-lts"
  }
}

resource "azurerm_static_site" "ss" {
  name                = var.name
  location            = var.location
  resource_group_name = azurerm_app_service_plan.asp.name

  sku_size = "Free"
  sku_tier = "Free"
}


