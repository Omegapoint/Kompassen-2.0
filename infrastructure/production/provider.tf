terraform {
  backend "azurerm" {
    resource_group_name  = "kompassen2"
    storage_account_name = "kompassen2"
    container_name       = "tfstate"
    key                  = "terraform.tfstate"
  }

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "2.64.0"
    }
  }
}

provider "azurerm" {
  features {}
}
