resource "random_string" "suffix" {
  length  = 6
  upper   = false
  special = false
  numeric = true
}

resource "azurerm_key_vault" "this" {
  name                        = substr(replace("${var.key_vault_name_prefix}${random_string.suffix.result}", "-", ""), 0, 24)
  location                    = var.location
  resource_group_name         = var.resource_group_name
  tenant_id                   = "00000000-0000-0000-0000-000000000000"
  sku_name                    = "standard"
  soft_delete_retention_days  = 90
  purge_protection_enabled    = true
  public_network_access_enabled = true
  enable_rbac_authorization   = var.enable_rbac_authorization
  tags                        = var.tags

  network_acls {
    bypass                     = "AzureServices"
    default_action             = "Deny"
    ip_rules                   = []
    virtual_network_subnet_ids = var.allowed_subnet_ids
  }
}
