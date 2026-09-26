output "resource_group_names" {
  description = "Resource group names created by the resource-group module."
  value       = module.resource_groups.resource_group_names
}

output "virtual_network_id" {
  description = "Virtual network id from the networking module."
  value       = module.networking.virtual_network_id
}

output "subnet_ids" {
  description = "Subnet id map from the networking module."
  value       = module.networking.subnet_ids
}

output "key_vault_id" {
  description = "Key Vault id from the key-vault module."
  value       = module.key_vault.key_vault_id
}

output "key_vault_uri" {
  description = "Key Vault URI from the key-vault module."
  value       = module.key_vault.key_vault_uri
}
