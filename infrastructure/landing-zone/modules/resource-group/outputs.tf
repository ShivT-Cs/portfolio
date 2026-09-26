output "resource_group_names" {
  description = "Resource group names keyed by input map key."
  value       = { for key, rg in azurerm_resource_group.this : key => rg.name }
}
