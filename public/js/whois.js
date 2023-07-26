const domainInput = document.getElementById('domainInput');
const lookupBtn = document.getElementById('lookupBtn');
const domainResult = document.getElementById('domainResult');
const whoisResult = document.getElementById('whoisResult');
const resultContainer = document.getElementById('resultContainer');
const copyBtn = document.getElementById('copyBtn');
const deleteBtn = document.getElementById('deleteBtn');
const shareBtn = document.getElementById('shareBtn');
   

function setLoadingState(loading) {
  if (loading) {
    lookupBtn.disabled = true;
    lookupBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Loading...';
  } else {
    lookupBtn.disabled = false;
    lookupBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Lookup';
  }
}

function performLookup() {
  const domain = domainInput.value.trim();
  if (!domain) return;
  location.hash = `#${domain}`

  setLoadingState(true);

  fetch(`/api/whois/${domain}`)
  .then(response => {
    if (response.status == 429) throw new Error("Rate limit reached, please try again later...");
    if (!response.ok) {
      throw new Error('Failed to fetch Whois data for the domain.');
    }
    return response.text();
  })
  .then(data => {
    domainResult.textContent = domain;
    whoisResult.textContent = data;
    resultContainer.classList.remove('d-none');
    copyBtn.innerHTML = `<i class="fas fa-copy me-2"></i>Copy`;
    copyBtn.disabled = false;
  })
  .catch(error => {
    resultContainer.classList.add('d-none');
    alert(error.message);
  })
  .finally(() => {
    setLoadingState(false);
  });
}

lookupBtn.addEventListener('click', performLookup);
domainInput.addEventListener('keypress', event => {
  if (event.keyCode === 13) {
    performLookup();
  }
});

copyBtn.addEventListener('click', () => {
  const textarea = document.createElement('textarea');
  textarea.value = whoisResult.textContent;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  copyBtn.textContent = 'Copied!';
  copyBtn.disabled = true;
});

deleteBtn.addEventListener('click', () => {
  location.hash = "";
  domainInput.value = '';
  resultContainer.classList.add('d-none');
});

function getTag() {
  var tag = window.location.hash; // Mendapatkan tag dari URL
  tag = tag.slice(1);
  if (!tag) return;
  domainInput.value = tag.trim();
  lookupBtn.click();
}

window.addEventListener("hashchange", getTag, false);

shareBtn.addEventListener('click', async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Whois Lookup Result',
            text: `Whois result for ${domainResult.textContent}`,
            url: window.location.origin + ("/#" + domainResult.textContent)
          });
          console.log('Successfully shared.');
        } catch (error) {
          console.error('Error sharing:', error);
        }
      } else {
        alert('Web Share API is not supported in this browser.');
      }
    });