locals {
  base_name = "${var.project_name}-${var.environment}"
}

module "resource_groups" {
  source = "./modules/resource-group"

  resource_groups = var.resource_groups
  common_tags     = var.tags
}

module "networking" {
  source = "./modules/networking"

  resource_group_name = module.resource_groups.resource_group_names[var.network_resource_group_key]
  location            = var.location
  vnet_name           = "${local.base_name}-${var.network.vnet_name}"
  address_space       = var.network.address_space
  subnets             = var.network.subnets
  tags                = var.tags
}

module "key_vault" {
  source = "./modules/key-vault"

  resource_group_name     = module.resource_groups.resource_group_names[var.network_resource_group_key]
  location                = var.location
  key_vault_name_prefix   = var.key_vault_name_prefix
  allowed_subnet_ids      = [module.networking.subnet_ids[var.key_vault_subnet_name]]
  enable_rbac_authorization = true
  tags                    = var.tags
}
