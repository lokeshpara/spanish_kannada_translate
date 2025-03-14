console.log('Content script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request);
  
  if (request.action === 'getSelectedText') {
    const selectedText = window.getSelection().toString().trim();
    console.log('Selected text:', selectedText);
    
    if (selectedText) {
      // Send the selected text to the background script for translation
      chrome.runtime.sendMessage({
        action: 'translate',
        text: selectedText,
        targetLanguage: request.targetLanguage
      }, response => {
        console.log('Translation response in content script:', response);
        if (chrome.runtime.lastError) {
          console.error('Chrome runtime error:', chrome.runtime.lastError);
          sendResponse({ translation: 'Error: ' + chrome.runtime.lastError.message });
        } else {
          sendResponse(response);
        }
      });
      return true; // Will respond asynchronously
    } else {
      console.log('No text selected');
      sendResponse({ translation: null });
    }
  }
}); 