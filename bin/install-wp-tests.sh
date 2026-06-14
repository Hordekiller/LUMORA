#!/bin/bash

# Download and install WordPress test suite for PHPUnit testing.
# Usage: bash bin/install-wp-tests.sh <db-name> [db-user] [db-pass] [db-host] [wp-version]

set -e

DB_NAME="${1:-lumora_tests}"
DB_USER="${2:-root}"
DB_PASS="${3:-}"
DB_HOST="${4:-localhost}"
WP_VERSION="${5:-latest}"

WP_TESTS_DIR="${WP_TESTS_DIR:-/tmp/wordpress-tests-lib}"
WP_CORE_DIR="${WP_CORE_DIR:-/tmp/wordpress}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

info() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

error() {
  echo -e "${RED}[ERROR]${NC} $1"
  exit 1
}

# Check dependencies
if ! command -v mysql >/dev/null 2>&1 && ! command -v mariadb >/dev/null 2>&1; then
  error "mysql or mariadb client not found. Install MySQL/MariaDB client."
fi
# Use mariadb if mysql is not available
if ! command -v mysql >/dev/null 2>&1 && command -v mariadb >/dev/null 2>&1; then
  mysql() { mariadb "$@"; }
fi
command -v wget >/dev/null 2>&1 || command -v curl >/dev/null 2>&1 || error "wget or curl required."

# Download WordPress core if not present
if [ ! -d "$WP_CORE_DIR" ]; then
  info "Downloading WordPress $WP_VERSION..."
  mkdir -p "$WP_CORE_DIR"
  if [ "$WP_VERSION" = "latest" ]; then
    WP_VERSION=$(wget -q -O- https://api.wordpress.org/core/version-check/1.7/ | grep -oP '"current":"\K[^"]+')
  fi
  wget -q "https://wordpress.org/wordpress-${WP_VERSION}.tar.gz" -O /tmp/wordpress.tar.gz
  tar -xzf /tmp/wordpress.tar.gz -C /tmp/
  rm -f /tmp/wordpress.tar.gz
fi

# Download WP test suite if not present
if [ ! -d "$WP_TESTS_DIR" ]; then
  info "Downloading WordPress test suite..."
  mkdir -p "$WP_TESTS_DIR"

  svn co --quiet https://develop.svn.wordpress.org/tags/${WP_VERSION}/tests/phpunit/includes/ "$WP_TESTS_DIR/includes" 2>/dev/null || \
  svn co --quiet https://develop.svn.wordpress.org/branches/6.4/tests/phpunit/includes/ "$WP_TESTS_DIR/includes" 2>/dev/null || \
  error "Could not download WP test suite includes"

  svn co --quiet https://develop.svn.wordpress.org/tags/${WP_VERSION}/tests/phpunit/data/ "$WP_TESTS_DIR/data" 2>/dev/null || \
  svn co --quiet https://develop.svn.wordpress.org/branches/6.4/tests/phpunit/data/ "$WP_TESTS_DIR/data" 2>/dev/null || \
  error "Could not download WP test suite data"
fi

# Create wp-tests-config.php
if [ ! -f "$WP_TESTS_DIR/wp-tests-config.php" ]; then
  info "Creating wp-tests-config.php..."
  cat > "$WP_TESTS_DIR/wp-tests-config.php" <<EOF
<?php
define( 'ABSPATH', '$WP_CORE_DIR/' );
define( 'DB_NAME', '$DB_NAME' );
define( 'DB_USER', '$DB_USER' );
define( 'DB_PASSWORD', '$DB_PASS' );
define( 'DB_HOST', '$DB_HOST' );
define( 'DB_CHARSET', 'utf8' );
define( 'DB_COLLATE', '' );
$table_prefix = 'wptests_';
define( 'WP_TESTS_DOMAIN', 'example.org' );
define( 'WP_TESTS_EMAIL', 'admin@example.org' );
define( 'WP_TESTS_TITLE', 'Test Blog' );
define( 'WP_PHP_BINARY', 'php' );
define( 'WPLANG', '' );
EOF
fi

# Create test database
info "Creating test database '$DB_NAME'..."
mysql -u "$DB_USER" ${DB_PASS:+-p"$DB_PASS"} -h "$DB_HOST" -e "CREATE DATABASE IF NOT EXISTS \`$DB_NAME\`;" 2>/dev/null || \
  error "Could not create database. Check MySQL credentials."

info "WordPress test suite installed at: $WP_TESTS_DIR"
info "Run tests with: vendor/bin/phpunit"
