variable "region" {}
variable "cluster_name" {}
variable "vpc_id" {}
variable "subnets" { type = list(string) }
variable "db_password" { sensitive = true }
