terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "19.21.0"

  cluster_name    = var.cluster_name
  cluster_version = "1.28"
  subnets         = var.subnets
  vpc_id          = var.vpc_id
}

module "rds" {
  source  = "terraform-aws-modules/rds/aws"
  version = "6.3.1"

  identifier = "supportdb"
  engine     = "postgres"
  engine_version = "15.2"
  instance_class = "db.t3.micro"
  username   = "user"
  password   = var.db_password
  allocated_storage = 20
  subnet_ids = var.subnets
}
