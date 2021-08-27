terraform {
  backend "azurerm" {
    resource_group_name  = "kompassen2setup"
    storage_account_name = "kompassen2setup"
    container_name       = "tfstate"
    key                  = "terraform.tfstate"
  }

  required_providers {
    azuread = {
      source  = "hashicorp/azuread"
      version = "2.0.1"
    }

    azurerm = {
      source  = "hashicorp/azurerm"
      version = "2.64.0"
    }

    github = {
      source  = "integrations/github"
      version = "~> 4.0"
    }

    local = {
      source  = "hashicorp/local"
      version = "2.1.0"
    }
  }
}

provider "azurerm" {
  features {}
}

provider "github" {
  owner = "Omegapoint"
}
