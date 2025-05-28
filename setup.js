#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

// Helper function to print colored messages
const print = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

// Helper function to check if a file exists
const fileExists = (filePath) => {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    return false;
  }
};

// Helper function to copy a file
const copyFile = (source, target) => {
  try {
    fs.copyFileSync(source, target);
    print(`✓ Created ${target}`, 'green');
  } catch (err) {
    print(`✗ Failed to create ${target}: ${err.message}`, 'red');
  }
};

// Main setup function
const setup = async () => {
  print('\n🚀 Setting up Motiv development environment...\n', 'bright');

  // Check Node.js version
  const nodeVersion = process.version;
  print(`Node.js version: ${nodeVersion}`, 'blue');

  // Install dependencies
  print('\n📦 Installing dependencies...', 'yellow');
  try {
    execSync('npm install', { stdio: 'inherit' });
    print('✓ Dependencies installed successfully', 'green');
  } catch (err) {
    print('✗ Failed to install dependencies', 'red');
    process.exit(1);
  }

  // Create configuration files
  print('\n⚙️  Setting up configuration files...', 'yellow');

  // Backend configuration
  const backendConfigExample = path.join(__dirname, 'backend', 'config', 'config.example.js');
  const backendConfig = path.join(__dirname, 'backend', 'config', 'config.js');
  if (!fileExists(backendConfig)) {
    copyFile(backendConfigExample, backendConfig);
  }

  // Frontend configuration
  const frontendConfigExample = path.join(__dirname, 'frontend', 'config', 'config.example.js');
  const frontendConfig = path.join(__dirname, 'frontend', 'config', 'config.js');
  if (!fileExists(frontendConfig)) {
    copyFile(frontendConfigExample, frontendConfig);
  }

  // Create .env files
  const backendEnvExample = path.join(__dirname, 'backend', '.env.example');
  const backendEnv = path.join(__dirname, 'backend', '.env');
  if (!fileExists(backendEnv)) {
    copyFile(backendEnvExample, backendEnv);
  }

  const frontendEnvExample = path.join(__dirname, 'frontend', '.env.example');
  const frontendEnv = path.join(__dirname, 'frontend', '.env');
  if (!fileExists(frontendEnv)) {
    copyFile(frontendEnvExample, frontendEnv);
  }

  print('\n✨ Setup completed successfully!', 'green');
  print('\nNext steps:', 'bright');
  print('1. Review and update the configuration files in backend/config/config.js and frontend/config/config.js', 'blue');
  print('2. Update the .env files in both backend and frontend directories with your actual values', 'blue');
  print('3. Start the development servers with: npm run dev', 'blue');
  print('\nHappy coding! 🎉\n', 'bright');
};

// Run the setup
setup().catch((err) => {
  print(`\n✗ Setup failed: ${err.message}`, 'red');
  process.exit(1);
}); 