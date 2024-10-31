#!/bin/bash

# Check if a widget name is provided
if [ -z "$1" ]; then
  echo "Please provide a widget name, e.g., yarn create-widget my-widget"
  exit 1
fi

WIDGET_NAME=$1
WIDGET_PATH="apps/$WIDGET_NAME"
TEMPLATE_DIR="templates"

# Ensure Yarn is available
if ! command -v yarn &> /dev/null; then
  echo "Error: Yarn is not installed. Please install Yarn and try again."
  exit 1
fi

# Check if the templates directory and template files exist
if [ ! -d "$TEMPLATE_DIR" ]; then
  echo "Error: Template directory '$TEMPLATE_DIR' not found."
  exit 1
fi

# Check required template files
REQUIRED_FILES=("widget-package.json" "tsconfig.app.json" "tsconfig.node.json" "tsconfig.json" "vite.config.ts")
for file in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$TEMPLATE_DIR/$file" ]; then
    echo "Error: Template file '$file' not found in '$TEMPLATE_DIR'."
    exit 1
  fi
done

# Use Vite to create the React TypeScript template
if ! yarn create vite $WIDGET_PATH --template react-ts; then
  echo "Error: Vite template creation failed."
  exit 1
fi

# Remove the auto-generated package.json in the new widget
if [ -f "$WIDGET_PATH/package.json" ]; then
  rm "$WIDGET_PATH/package.json"
fi

# Remove the auto-generated eslint.config.js in the new widget
if [ -f "$WIDGET_PATH/eslint.config.js" ]; then
  rm "$WIDGET_PATH/eslint.config.js"
fi

# Copy the template package.json to the new widget directory
cp "$TEMPLATE_DIR/widget-package.json" "$WIDGET_PATH/package.json"

# Replace placeholder name in package.json with actual widget name (cross-platform)
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i "" "s/new_widget/$WIDGET_NAME/g" "$WIDGET_PATH/package.json"
else
  sed -i "s/new_widget/$WIDGET_NAME/g" "$WIDGET_PATH/package.json"
fi

# Copy tsconfig files and replace the placeholder in tsconfig.json
cp "$TEMPLATE_DIR/tsconfig.app.json" "$WIDGET_PATH/tsconfig.app.json"
cp "$TEMPLATE_DIR/tsconfig.node.json" "$WIDGET_PATH/tsconfig.node.json"
cp "$TEMPLATE_DIR/tsconfig.json" "$WIDGET_PATH/tsconfig.json"

# Replace placeholder path in tsconfig.json with actual shared path
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i "" "s|PLACEHOLDER_SHARED_PATH|../shared|g" "$WIDGET_PATH/tsconfig.json"
else
  sed -i "s|PLACEHOLDER_SHARED_PATH|../shared|g" "$WIDGET_PATH/tsconfig.json"
fi

# Copy Vite configuration
cp "$TEMPLATE_DIR/vite.config.ts" "$WIDGET_PATH/vite.config.ts"

# Run yarn install at the root to ensure dependencies are aligned
echo "Running yarn install to synchronize dependencies..."
if ! yarn install; then
  echo "Error: Yarn install failed."
  exit 1
fi

echo "New React widget '$WIDGET_NAME' created successfully!"