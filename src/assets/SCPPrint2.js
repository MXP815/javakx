export function loadPrintScript() {
  return new Promise((resolve, reject) => {
    if (window.SCPPrint) {
      resolve(window.SCPPrint);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://scp-tcdn.sf-express.com/prd/sdk/lodop/2.7/SCPPrint.js';
    script.onload = () => resolve(window.SCPPrint);
    script.onerror = reject;
    document.body.appendChild(script);
  });
}
