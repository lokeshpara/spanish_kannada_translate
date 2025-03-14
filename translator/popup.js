document.addEventListener('DOMContentLoaded', function() {
  const translateBtn = document.getElementById('translateBtn');
  const targetLanguage = document.getElementById('targetLanguage');
  const resultBox = document.getElementById('result');

  translateBtn.addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab) {
        throw new Error('No active tab found');
      }

      resultBox.textContent = 'Detecting language...';
      resultBox.classList.add('show');

      // First, inject the content script
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
      
      // Then send the message
      chrome.tabs.sendMessage(tab.id, {
        action: 'getSelectedText',
        targetLanguage: targetLanguage.value
      }, response => {
        if (chrome.runtime.lastError) {
          console.error('Chrome runtime error:', chrome.runtime.lastError);
          resultBox.textContent = 'Error: ' + chrome.runtime.lastError.message;
        } else if (response && response.translation) {
          resultBox.textContent = response.translation;
        } else {
          resultBox.textContent = 'Please select some text on the page first.';
        }
      });
    } catch (error) {
      console.error('Error:', error);
      resultBox.textContent = 'Error: ' + error.message;
      resultBox.classList.add('show');
    }
  });
}); 