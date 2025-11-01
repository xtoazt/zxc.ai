#!/bin/bash

# Script to remove secrets from Git history
# Run this if you need to clean up previously committed secrets

echo "🔐 Removing secrets from Git history..."
echo "====================================="

# Option 1: Remove files from git tracking but keep locally
echo "Removing veo.js and rndm.js from git tracking..."
git rm --cached veo.js 2>/dev/null || echo "veo.js not tracked"
git rm --cached rndm.js 2>/dev/null || echo "rndm.js not tracked"

echo ""
echo "✅ Files removed from git tracking"
echo ""
echo "⚠️  If secrets are already in commit history, you may need to:"
echo "   1. Use git filter-branch or BFG Repo-Cleaner"
echo "   2. Or force push after cleaning (if allowed)"
echo ""
echo "For now, the files are excluded from future commits."
