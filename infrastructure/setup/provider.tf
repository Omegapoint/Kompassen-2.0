terraform {
  required_providers {
    azuread = {
      source  = "hashicorp/azuread"
      version = "1.5.1"
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
