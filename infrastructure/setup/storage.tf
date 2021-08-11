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

  lifecycle {
    ignore_changes = [content_md5]
  }
}
