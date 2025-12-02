#!/bin/bash

echo "=========================================="
echo "Dormant Accounts App - Setup Script"
echo "=========================================="
echo ""

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew is not installed."
    echo "Please install Homebrew first:"
    echo '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
    exit 1
fi

echo "✅ Homebrew is installed"
echo ""

# Check and install Java
echo "Checking Java installation..."
if ! command -v java &> /dev/null; then
    echo "📦 Installing Java 17..."
    brew install openjdk@17
    
    # Add Java to PATH
    echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
    export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"
    
    echo "✅ Java 17 installed"
else
    echo "✅ Java is already installed: $(java -version 2>&1 | head -n 1)"
fi
echo ""

# Check and install Node.js
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    brew install node
    echo "✅ Node.js installed"
else
    echo "✅ Node.js is already installed: $(node -v)"
    echo "✅ npm is already installed: $(npm -v)"
fi
echo ""

# Setup Maven Wrapper for backend
echo "Setting up Maven Wrapper..."
cd backend
if [ ! -f "mvnw" ]; then
    echo "📦 Downloading Maven Wrapper..."
    curl -o maven-wrapper.jar https://repo1.maven.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar
    
    # Create mvnw script
    cat > mvnw << 'EOF'
#!/bin/sh
exec mvn "$@"
EOF
    chmod +x mvnw
fi
echo "✅ Maven Wrapper ready"
cd ..
echo ""

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
echo "✅ Frontend dependencies installed"
cd ..
echo ""

echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "To start the application:"
echo ""
echo "1. Start the backend (in one terminal):"
echo "   cd backend && ./mvnw spring-boot:run"
echo ""
echo "2. Start the frontend (in another terminal):"
echo "   cd frontend && npm start"
echo ""
echo "The app will be available at: http://localhost:3000"
echo "Backend API will be at: http://localhost:8080"
echo ""
