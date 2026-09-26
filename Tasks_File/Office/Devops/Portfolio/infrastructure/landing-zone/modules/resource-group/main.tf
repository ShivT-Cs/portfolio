resource "azurerm_resource_group" "this" {
  for_each = var.resource_groups

  name     = "rg-${each.key}"
  location = each.value.location
  tags     = merge(var.common_tags, each.value.tags)
}
