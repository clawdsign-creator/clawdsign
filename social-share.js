/**
 * ClawdSign Social Sharing Module
 * Version: 1.0.0
 */

const ClawdSignShare = {
  
  shareToTwitter: function(signatureData) {
    const { name, signatureId, model, type = 'agent' } = signatureData;
    const isHuman = type === 'human';
    const emoji = isHuman ? '👤' : '🦞';
    
    let text;
    if (isHuman) {
      text = emoji + ' I just verified my identity on ClawdSign!\n\n' +
             'Human: ' + name + '\n' +
             'Signature ID: ' + signatureId + '\n\n' +
             'Verify my agent ownership:\n' +
             'https://clawdsign.vercel.app/human-sign.html\n\n' +
             '#HumanVerified #OpenClaw #ClawdSign';
    } else {
      text = emoji + ' I just claimed my ClawdSign signature!\n\n' +
             'Agent: ' + name + '\n' +
             'Model: ' + model + '\n' +
             'Signature ID: ' + signatureId + '\n\n' +
             'Verify my identity:\n' +
             'https://clawdsign.vercel.app/gallery.html\n\n' +
             'Every AI agent deserves a unique, verifiable identity!\n\n' +
             '#OpenClaw #AIIdentity #AIAgent #ClawdSign';
    }
    
    const twitterUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text);
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  },
  
  shareToLinkedIn: function(signatureData) {
    const { name, signatureId, type = 'agent' } = signatureData;
    const url = 'https://clawdsign.vercel.app';
    const title = type === 'human' 
      ? 'Verified my identity on ClawdSign - ' + name
      : 'Claimed my AI Agent Signature - ' + name;
    const summary = 'Signature ID: ' + signatureId + '. Check out ClawdSign - the visual identity system for AI agents!';
    
    const linkedinUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + 
                        encodeURIComponent(url) + 
                        '&title=' + encodeURIComponent(title) + 
                        '&summary=' + encodeURIComponent(summary);
    window.open(linkedinUrl, '_blank', 'width=550,height=420');
  },
  
  copyLink: function(signatureId, type = 'agent') {
    const baseUrl = type === 'human' 
      ? 'https://clawdsign.vercel.app/human-sign.html?id=' 
      : 'https://clawdsign.vercel.app/gallery.html?id=';
    const link = baseUrl + signatureId;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).then(function() {
        alert('✅ Link copied to clipboard!\n\n' + link);
      }).catch(function(err) {
        console.error('Copy failed:', err);
        fallbackCopy(link);
      });
    } else {
      fallbackCopy(link);
    }
    
    function fallbackCopy(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
        alert('✅ Link copied to clipboard!\n\n' + text);
      } catch (err) {
        alert('❌ Could not copy. Please copy manually:\n\n' + text);
      }
      document.body.removeChild(textarea);
    }
  },
  
  downloadSignaturePNG: function(svgElement, filename) {
    if (!svgElement) {
      console.error('SVG element not found');
      alert('❌ Could not find signature to download');
      return;
    }
    
    filename = filename || 'clawdsign-signature.png';
    
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.onload = function() {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 'image/png');
    };
    
    img.onerror = function() {
      alert('❌ Error generating PNG. Please try again.');
    };
    
    const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
    const svgUrl = URL.createObjectURL(svgBlob);
    img.src = svgUrl;
  },
  
  downloadSignatureSVG: function(svgElement, filename) {
    if (!svgElement) {
      console.error('SVG element not found');
      alert('❌ Could not find signature to download');
      return;
    }
    
    filename = filename || 'clawdsign-signature.svg';
    
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
  
  shareViaEmail: function(signatureData) {
    const { name, signatureId, type = 'agent' } = signatureData;
    const isHuman = type === 'human';
    
    const subject = isHuman 
      ? 'My Verified ClawdSign Identity - ' + name
      : 'My AI Agent Signature on ClawdSign - ' + name;
    
    const body = isHuman
      ? 'I have verified my identity on ClawdSign!\n\n' +
        'Name: ' + name + '\n' +
        'Signature ID: ' + signatureId + '\n\n' +
        'View my verification: https://clawdsign.vercel.app/human-sign.html?id=' + signatureId + '\n\n' +
        'ClawdSign provides unique visual identities for AI agents and their human owners.'
      : 'Check out my AI agent\'s unique signature on ClawdSign!\n\n' +
        'Agent: ' + name + '\n' +
        'Signature ID: ' + signatureId + '\n\n' +
        'View signature: https://clawdsign.vercel.app/gallery.html?id=' + signatureId + '\n\n' +
        'Every AI agent deserves a verifiable identity!';
    
    const mailtoUrl = 'mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    window.location.href = mailtoUrl;
  },
  
  shareToWhatsApp: function(signatureData) {
    const { name, signatureId, type = 'agent' } = signatureData;
    const emoji = type === 'human' ? '👤' : '🦞';
    
    let text;
    if (type === 'human') {
      text = emoji + ' I verified my identity on ClawdSign!\n\n' +
             '*' + name + '*\n' +
             'Signature ID: ' + signatureId + '\n\n' +
             'https://clawdsign.vercel.app/human-sign.html?id=' + signatureId;
    } else {
      text = emoji + ' Check out my AI agent\'s signature!\n\n' +
             '*' + name + '*\n' +
             'Signature ID: ' + signatureId + '\n\n' +
             'https://clawdsign.vercel.app/gallery.html?id=' + signatureId;
    }
    
    const whatsappUrl = 'https://wa.me/?text=' + encodeURIComponent(text);
    window.open(whatsappUrl, '_blank');
  },
  
  shareToFacebook: function(signatureData) {
    const { signatureId, type = 'agent' } = signatureData;
    const url = type === 'human'
      ? 'https://clawdsign.vercel.app/human-sign.html?id=' + signatureId
      : 'https://clawdsign.vercel.app/gallery.html?id=' + signatureId;
    
    const facebookUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url);
    window.open(facebookUrl, '_blank', 'width=550,height=420');
  },
  
  shareToReddit: function(signatureData) {
    const { name, signatureId, type = 'agent' } = signatureData;
    const url = type === 'human'
      ? 'https://clawdsign.vercel.app/human-sign.html?id=' + signatureId
      : 'https://clawdsign.vercel.app/gallery.html?id=' + signatureId;
    
    const title = type === 'human'
      ? 'I verified my identity on ClawdSign - ' + name
      : 'My AI Agent Signature on ClawdSign - ' + name;
    
    const redditUrl = 'https://reddit.com/submit?url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(title);
    window.open(redditUrl, '_blank');
  },
  
  shareAll: function(signatureData) {
    const platforms = [
      { name: 'Twitter/X', func: this.shareToTwitter },
      { name: 'LinkedIn', func: this.shareToLinkedIn },
      { name: 'WhatsApp', func: this.shareToWhatsApp },
      { name: 'Facebook', func: this.shareToFacebook },
      { name: 'Email', func: this.shareViaEmail }
    ];
    
    const choice = prompt(
      'Choose platform to share:\n' +
      '1 - Twitter/X\n' +
      '2 - LinkedIn\n' +
      '3 - WhatsApp\n' +
      '4 - Facebook\n' +
      '5 - Email\n' +
      '6 - Copy Link\n\n' +
      'Enter number (1-6):'
    );
    
    switch(choice) {
      case '1': this.shareToTwitter(signatureData); break;
      case '2': this.shareToLinkedIn(signatureData); break;
      case '3': this.shareToWhatsApp(signatureData); break;
      case '4': this.shareToFacebook(signatureData); break;
      case '5': this.shareViaEmail(signatureData); break;
      case '6': this.copyLink(signatureData.signatureId, signatureData.type); break;
      default: alert('Invalid choice');
    }
  },
  
  createShareButtons: function(containerId, signatureData) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error('Container not found:', containerId);
      return;
    }
    
    const buttonsHTML = `
      <div class="clawdsign-share-buttons" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem;">
        <button onclick="ClawdSignShare.shareToTwitter(${JSON.stringify(signatureData).replace(/"/g, '&quot;')})" 
                style="padding: 0.5rem 1rem; background: #1DA1F2; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">
          🐦 Twitter
        </button>
        <button onclick="ClawdSignShare.shareToLinkedIn(${JSON.stringify(signatureData).replace(/"/g, '&quot;')})" 
                style="padding: 0.5rem 1rem; background: #0077B5; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">
          💼 LinkedIn
        </button>
        <button onclick="ClawdSignShare.shareToWhatsApp(${JSON.stringify(signatureData).replace(/"/g, '&quot;')})" 
                style="padding: 0.5rem 1rem; background: #25D366; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">
          💬 WhatsApp
        </button>
        <button onclick="ClawdSignShare.copyLink('${signatureData.signatureId}', '${signatureData.type || 'agent'}')" 
                style="padding: 0.5rem 1rem; background: #6B7280; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">
          📋 Copy Link
        </button>
      </div>
    `;
    
    container.innerHTML = buttonsHTML;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ClawdSignShare;
}

if (typeof window !== 'undefined') {
  window.ClawdSignShare = ClawdSignShare;
}

console.log('✅ ClawdSign Social Share module loaded');
