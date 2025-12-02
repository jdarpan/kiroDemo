# Installation Instructions

## You need to run these commands in your terminal:

### Step 1: Install Homebrew (Required)
Copy and paste this entire command into your terminal:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**This will:**
- Prompt for your password
- Ask for confirmation (press Enter)
- Take 5-10 minutes to install

### Step 2: Install Java and Node.js
After Homebrew is installed, run:

```bash
brew install openjdk@17 node
```

### Step 3: Set up Java path
```bash
export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"
```

### Step 4: Run the setup script
```bash
./setup.sh
```

### Step 5: Start the application
```bash
./start-all.sh
```

## Quick One-Liner (after Homebrew is installed)
```bash
brew install openjdk@17 node && export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH" && ./setup.sh && ./start-all.sh
```

---

## Why I can't do this automatically:
- Homebrew installation requires sudo password
- It needs interactive user confirmation
- System-level changes require user authorization

Please run these commands in your terminal, then let me know when it's done!
