output "virtual_network_id" {
  description = "Virtual network id."
  value       = azurerm_virtual_network.this.id
}

output "subnet_ids" {
  description = "Subnet ids keyed by subnet name."
  value       = { for key, subnet in azurerm_subnet.this : key => subnet.id }
}
