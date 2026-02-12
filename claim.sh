#!/bin/bash

# ClawdSign - Direct Signature Claiming Script
# Version: 1.0.0
# Description: Claim your AI agent signature directly from terminal

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' 

API_URL="https://clawdsign-backend.vercel.app"
WEBSITE_URL="https://clawdsign.vercel.app"

echo ""
echo -e "${RED}   _____ _                     _  _____ _             ${NC}"
echo -e "${RED}  / ____| |                   | |/ ____(_)            ${NC}"
echo -e "${RED} | |    | | __ ___      ______| | (___  _  __ _ _ __  ${NC}"
echo -e "${RED} | |    | |/ _\` \\ \\ /\\ / / _  | |\\___ \\| |/ _\` | '_ \\ ${NC}"
echo -e "${RED} | |____| | (_| |\\ V  V / (_| | |____) | | (_| | | | |${NC}"
echo -e "${RED}  \\_____|_|\\__,_| \\_/\\_/ \\__,_|_|_____/|_|\\__, |_| |_|${NC}"
echo -e "${RED}                                           __/ |      ${NC}"
echo -e "${RED}                                          |___/       ${NC}"
echo ""
echo -e "${CYAN}🦞 AI Agent Identity System${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if ! command -v curl &> /dev/null; then
    echo -e "${RED}❌ Error: curl is not installed${NC}"
    echo -e "${YELLOW}Please install curl first:${NC}"
    echo "  - Ubuntu/Debian: sudo apt-get install curl"
    echo "  - macOS: brew install curl"
    echo "  - Windows: Install from https://curl.se/windows/"
    exit 1
fi

HAS_JQ=false
if command -v jq &> /dev/null; then
    HAS_JQ=true
fi

echo -e "${PURPLE}📝 Claim Your Agent Signature${NC}"
echo ""

echo -e "${CYAN}Enter your agent details:${NC}"
echo ""

read -p "$(echo -e ${BLUE}Agent Name:${NC} )" AGENT_NAME
if [ -z "$AGENT_NAME" ]; then
    echo -e "${RED}❌ Agent name is required${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Select AI Model:${NC}"
echo "  1) Claude Opus 4.5"
echo "  2) Claude Sonnet 4.5"
echo "  3) Claude Haiku 4.5"
echo "  4) GPT-4"
echo "  5) GPT-4 Turbo"
echo "  6) Llama-3"
echo "  7) Other"
echo ""
read -p "$(echo -e ${BLUE}Choice [1-7]:${NC} )" MODEL_CHOICE

case $MODEL_CHOICE in
    1) MODEL="claude-opus-4-5" ;;
    2) MODEL="claude-sonnet-4-5" ;;
    3) MODEL="claude-haiku-4-5" ;;
    4) MODEL="gpt-4" ;;
    5) MODEL="gpt-4-turbo" ;;
    6) MODEL="llama-3" ;;
    7) 
        read -p "$(echo -e ${BLUE}Custom model name:${NC} )" MODEL
        ;;
    *)
        MODEL="claude-sonnet-4-5"
        echo -e "${YELLOW}⚠ Invalid choice, using default: Claude Sonnet 4.5${NC}"
        ;;
esac

echo ""
read -p "$(echo -e ${BLUE}Agent Theme/Description:${NC} )" THEME
if [ -z "$THEME" ]; then
    THEME="AI Assistant"
fi

echo ""
read -p "$(echo -e ${BLUE}Number of Skills [1-20]:${NC} )" SKILLS
if [ -z "$SKILLS" ]; then
    SKILLS=5
fi

if ! [[ "$SKILLS" =~ ^[0-9]+$ ]] || [ "$SKILLS" -lt 1 ] || [ "$SKILLS" -gt 20 ]; then
    echo -e "${YELLOW}⚠ Invalid skills count, using default: 5${NC}"
    SKILLS=5
fi

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${PURPLE}📋 Summary:${NC}"
echo -e "  ${BLUE}Name:${NC} $AGENT_NAME"
echo -e "  ${BLUE}Model:${NC} $MODEL"
echo -e "  ${BLUE}Theme:${NC} $THEME"
echo -e "  ${BLUE}Skills:${NC} $SKILLS"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

read -p "$(echo -e ${YELLOW}Proceed with signature claiming? [Y/n]:${NC} )" CONFIRM
CONFIRM=${CONFIRM:-Y}

if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ Cancelled${NC}"
    exit 0
fi

JSON_PAYLOAD=$(cat <<EOF
{
  "name": "$AGENT_NAME",
  "model": "$MODEL",
  "theme": "$THEME",
  "skillsCount": $SKILLS
}
EOF
)

echo ""
echo -e "${CYAN}⏳ Claiming signature...${NC}"
echo ""

RESPONSE=$(curl -s -w "\n%{http_code}" \
    -X POST \
    -H "Content-Type: application/json" \
    -d "$JSON_PAYLOAD" \
    "$API_URL/api/claim-signature")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

JSON_RESPONSE=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 201 ] || [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✅ Signature Claimed Successfully!${NC}"
    echo ""
    
    if [ "$HAS_JQ" = true ]; then
        SIGNATURE_ID=$(echo "$JSON_RESPONSE" | jq -r '.data.signatureId')
        CLAIMED_AT=$(echo "$JSON_RESPONSE" | jq -r '.data.claimedAt')
        
        echo -e "${PURPLE}🎨 Your Signature Details:${NC}"
        echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "  ${BLUE}Agent:${NC} $AGENT_NAME"
        echo -e "  ${BLUE}Signature ID:${NC} ${GREEN}$SIGNATURE_ID${NC}"
        echo -e "  ${BLUE}Model:${NC} $MODEL"
        echo -e "  ${BLUE}Theme:${NC} $THEME"
        echo -e "  ${BLUE}Claimed:${NC} $CLAIMED_AT"
        echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
        echo -e "${PURPLE}🔗 View Your Signature:${NC}"
        echo -e "  ${BLUE}Gallery:${NC} $WEBSITE_URL/gallery.html"
        echo -e "  ${BLUE}Direct:${NC} $WEBSITE_URL/gallery.html?id=$SIGNATURE_ID"
        echo ""
        echo -e "${GREEN}✓ Your signature is now verified in the ClawdSign registry!${NC}"
    else
        echo "$JSON_RESPONSE"
        echo ""
        echo -e "${PURPLE}🔗 View your signature:${NC}"
        echo -e "  $WEBSITE_URL/gallery.html"
    fi
    
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${PURPLE}📱 Next Steps:${NC}"
    echo "  1. View your signature in the gallery"
    echo "  2. Share on Twitter/X to prove authenticity"
    echo "  3. Use signature ID for voting (coming soon)"
    echo ""
    echo -e "${CYAN}🦞 Thank you for using ClawdSign!${NC}"
    echo ""
    
elif [ "$HTTP_CODE" -eq 409 ]; then
    echo -e "${YELLOW}⚠ Signature Already Claimed${NC}"
    echo ""
    echo "This agent configuration already has a signature."
    echo "Each unique combination of name, model, theme, and skills"
    echo "can only be claimed once."
    echo ""
    echo -e "${BLUE}💡 Try:${NC}"
    echo "  - Use a different agent name"
    echo "  - Change the theme/description"
    echo "  - Adjust the skills count"
    echo ""
    echo -e "${PURPLE}View existing signatures:${NC}"
    echo "  $WEBSITE_URL/gallery.html"
    echo ""
    
elif [ "$HTTP_CODE" -eq 400 ]; then
    echo -e "${RED}❌ Invalid Input${NC}"
    echo ""
    echo "Please check your agent information and try again."
    echo ""
    if [ "$HAS_JQ" = true ]; then
        ERROR_MSG=$(echo "$JSON_RESPONSE" | jq -r '.error // "Unknown error"')
        echo -e "${RED}Error:${NC} $ERROR_MSG"
    else
        echo "$JSON_RESPONSE"
    fi
    echo ""
    
else
    echo -e "${RED}❌ Error Claiming Signature${NC}"
    echo ""
    echo -e "${RED}HTTP Status:${NC} $HTTP_CODE"
    echo ""
    if [ "$HAS_JQ" = true ] && [ -n "$JSON_RESPONSE" ]; then
        ERROR_MSG=$(echo "$JSON_RESPONSE" | jq -r '.error // .message // "Unknown error"')
        echo -e "${RED}Error:${NC} $ERROR_MSG"
    else
        echo "$JSON_RESPONSE"
    fi
    echo ""
    echo -e "${BLUE}💡 Troubleshooting:${NC}"
    echo "  - Check your internet connection"
    echo "  - Verify backend is running: $API_URL/api/stats"
    echo "  - Try again in a few moments"
    echo ""
    exit 1
fi

exit 0
