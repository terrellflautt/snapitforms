
//AppManager.js
import { QRManager } from './qrmanager.js';
import { StorageManager } from './storagemanager.js';
import { LogoManager } from './logomanager.js';
import { LogoEditor } from './logoeditor.js';


export const AppManager = (() => {
  const elements = {
    urlInput: document.getElementById('urlInput'),
    textInput: document.getElementById('textInput'),
    colorPicker: document.getElementById('colorPicker'),
    qrColorPicker: document.getElementById('qrColorPicker'),
    borderColorPicker: document.getElementById('borderColorPicker'),
    borderWidth: document.getElementById('borderWidth'),
    textBackgroundColorPicker: document.getElementById('textBackgroundColorPicker'),
    qrcodeCanvas: document.getElementById('qrcodeCanvas'),
    downloadBtn: document.getElementById('downloadQRCodeButton'),
    saveBtn: document.getElementById('saveQRCodeButton'),
    dashboardItems: document.getElementById('dashboardItems'),
    logoSizeSlider: document.getElementById('logoSizeSlider'),
    removeLogoBtn: document.getElementById('removeLogoBtn'),
    logoOverlay: document.getElementById('logoOverlay'),
    logoOpacitySlider: document.getElementById('logoOpacitySlider'),
    logoOpacityValue: document.getElementById('logoOpacityValue'),
    centerLogoBtn: document.getElementById('centerLogoBtn'), // New button for centering logo
  };

  let currentEditId = null;
  let currentLogoContainer = null; // Track the current logo container

  const UIManager = {
    toggleButtons: (enabled) => {
      elements.downloadBtn.disabled = !enabled;
      elements.saveBtn.disabled = !enabled;
      console.log('[AppManager/UIManager] Buttons toggled:', enabled ? 'enabled' : 'disabled');
    },
    updatePreview: () => {
      console.log('[AppManager/UIManager] Triggering updatePreview.');
      updateLivePreview();
    },
    renderDashboard: () => {
      elements.dashboardItems.innerHTML = '';
      const savedItems = StorageManager.getQRCodes();
      console.log('[AppManager/UIManager] Rendering dashboard with saved items:', savedItems);

      if (savedItems.length === 0) {
        elements.dashboardItems.innerHTML = `<p>No saved QR codes yet!</p>`;
        return;
      }

      savedItems.forEach((item) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'dashboard-item';

        const qrWrapper = document.createElement('div');
        qrWrapper.className = 'qrcode-wrapper';

        const canvas = document.createElement('canvas');
        canvas.width = 150;
        canvas.height = 150;
        qrWrapper.appendChild(canvas);

        // Use stored logo state to ensure consistency:
        QRManager.getCombinedCanvas({
          url: item.url,
          customText: item.customText || '',
          foregroundColor: item.foregroundColor || '#000000',
          backgroundColor: item.backgroundColor || '#FFFFFF',
          logoData: item.logo?.data || null,
          borderColor: item.borderColor || '#000000',
          borderWidth: item.borderWidth || 0,
          textBackgroundColor: item.textBackgroundColor || null,
          // Pass logo parameters saved in the item:
          logoSize: item.logo?.size || 20,
          logoXPercent: item.logo?.xPercent || 50,
          logoYPercent: item.logo?.yPercent || 50,
          logoOpacity: item.logo?.opacity || 1,
        }, (combinedCanvas) => {
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(combinedCanvas, 0, 0, canvas.width, canvas.height);
        });

        const btnGroup = document.createElement('div');
        btnGroup.className = 'dashboard-btns';
        btnGroup.innerHTML = `
          <button class="btn edit-btn">Edit</button>
          <button class="btn delete-btn">Delete</button>
        `;
        btnGroup.querySelector('.edit-btn').onclick = () => {
          console.log('[AppManager/UIManager] Editing item:', item);
          elements.urlInput.value = item.url;
          elements.textInput.value = item.customText || '';
          elements.qrColorPicker.value = item.foregroundColor || '#000000';
          elements.colorPicker.value = item.backgroundColor || '#FFFFFF';
          elements.borderColorPicker.value = item.borderColor || '#000000';
          elements.borderWidth.value = item.borderWidth || 0;
          elements.textBackgroundColorPicker.value = item.textBackgroundColor || '#FFFFFF';
          currentEditId = item.id;
          UIManager.updatePreview();
        };
        btnGroup.querySelector('.delete-btn').onclick = () => {
          console.log('[AppManager/UIManager] Deleting item with id:', item.id);
          StorageManager.deleteQRCode(item.id);
          UIManager.renderDashboard();
        };

        itemEl.append(qrWrapper, btnGroup);
        elements.dashboardItems.appendChild(itemEl);
      });
    }
  };

  /**
   * Updates the live preview by rendering the QR code and the logo overlay.
   * The logo overlay is positioned in the center by default.
   */
  const updateLivePreview = () => {
    const url = elements.urlInput.value.trim();
    if (!url) {
      console.warn('[AppManager] No URL provided. Live preview not updated.');
      UIManager.toggleButtons(false);
      return;
    }

    const currentLogo = LogoManager.getCurrentLogo();
    // Retrieve stored state or use default values (centered, smaller size)
    const logoState = LogoManager.getCurrentLogoState() || { xPercent: 50, yPercent: 50, sizePercent: 20, opacity: 1 };

    // Render the base QR code onto the canvas with consistent logo parameters
    QRManager.renderCanvas(elements.qrcodeCanvas, {
      url,
      foregroundColor: elements.qrColorPicker.value,
      backgroundColor: elements.colorPicker.value,
      logoData: currentLogo ? currentLogo.data : null,
      borderColor: elements.borderColorPicker.value,
      borderWidth: parseInt(elements.borderWidth.value, 10),
      customText: elements.textInput.value.trim(),
      textBackgroundColor: elements.textBackgroundColorPicker.value || null,
      // Use state values for consistency:
      logoSize: logoState.sizePercent,
      logoOpacity: logoState.opacity,
      logoXPercent: logoState.xPercent,
      logoYPercent: logoState.yPercent,
    }, true);

    // Update the live preview logo overlay
    const previewContainer = document.getElementById('previewContainer');
    elements.logoOverlay.innerHTML = '';
    currentLogoContainer = null; // Reset the current logo container reference

    if (currentLogo && currentLogo.data) {
      // Create a dedicated container for the logo (for drag/resize support)
      const logoContainer = document.createElement('div');
      logoContainer.className = 'logo-container';
      // Set pointer-events to auto so that the logo can be interacted with
      logoContainer.style.pointerEvents = 'auto';
      logoContainer.style.position = 'absolute';
      logoContainer.style.zIndex = '3';

      // Create the logo image element
      const logoImg = document.createElement('img');
      logoImg.src = currentLogo.data;
      logoImg.alt = 'Logo';
      logoImg.style.width = '100%';
      logoImg.style.height = '100%';
      logoImg.style.display = 'block';

      // Append the image to the container
      logoContainer.appendChild(logoImg);
      elements.logoOverlay.appendChild(logoContainer);
      currentLogoContainer = logoContainer; // Store reference to logo container

      // Calculate container dimensions based on the stored state
      const containerWidth = previewContainer.clientWidth;
      const containerHeight = previewContainer.clientHeight;
      const logoWidth = containerWidth * (logoState.sizePercent / 100);
      
      // Calculate left/top so that the center of the logo is at the specified percentages
      const left = (containerWidth * logoState.xPercent / 100) - (logoWidth / 2);
      const top = (containerHeight * logoState.yPercent / 100) - (logoWidth / 2);
      
      logoContainer.style.width = `${logoWidth}px`;
      logoContainer.style.height = `${logoWidth}px`;
      logoContainer.style.left = `${left}px`;
      logoContainer.style.top = `${top}px`;
      logoContainer.style.opacity = logoState.opacity;

      console.log('[AppManager] Updated logoOverlay with current logo container.');
      console.log('[AppManager] Logo position:', { left, top, xPercent: logoState.xPercent, yPercent: logoState.yPercent });

      // Initialize dragging and resizing via LogoEditor
      LogoEditor.init(logoContainer, previewContainer);

      // Update UI controls to match the current logo state
      elements.logoSizeSlider.value = logoState.sizePercent;
      elements.logoOpacitySlider.value = logoState.opacity * 100;
      elements.logoOpacityValue.textContent = Math.round(logoState.opacity * 100);

      // Show the remove logo and center logo buttons
      elements.removeLogoBtn.style.display = 'inline-block';
      if (elements.centerLogoBtn) {
        elements.centerLogoBtn.style.display = 'inline-block';
      }

      // Attach a window resize listener to update logo container positioning
      window.addEventListener('resize', () => {
        if (typeof LogoEditor.updateOnResize === 'function') {
          LogoEditor.updateOnResize(logoContainer, previewContainer);
        } else {
          // Fallback: re-run preview update
          UIManager.updatePreview();
        }
      });
    } else {
      console.log('[AppManager] No logo selected; logoOverlay cleared.');
      // Hide the remove logo and center logo buttons when no logo is present
      elements.removeLogoBtn.style.display = 'none';
      if (elements.centerLogoBtn) {
        elements.centerLogoBtn.style.display = 'none';
      }
    }
    
    UIManager.toggleButtons(true);
  };

  /**
   * Centers the currently displayed logo in the QR code
   */
  const centerCurrentLogo = () => {
    if (currentLogoContainer) {
      const previewContainer = document.getElementById('previewContainer');
      LogoEditor.centerLogo(currentLogoContainer, previewContainer);
      console.log('[AppManager] Logo centered.');
    }
  };

  const setupEventListeners = () => {
    console.log('[AppManager] Setting up event listeners.');

    elements.urlInput.addEventListener('input', UIManager.updatePreview);
    elements.textInput.addEventListener('input', UIManager.updatePreview);
    elements.qrColorPicker.addEventListener('input', UIManager.updatePreview);
    elements.colorPicker.addEventListener('input', UIManager.updatePreview);
    elements.borderColorPicker.addEventListener('input', UIManager.updatePreview);
    elements.borderWidth.addEventListener('input', UIManager.updatePreview);
    elements.textBackgroundColorPicker.addEventListener('input', UIManager.updatePreview);

    // Update logo size slider to update LogoManager state
    elements.logoSizeSlider.addEventListener('input', (e) => {
      const size = parseInt(e.target.value, 10);
      console.log('[AppManager] Adjusting logo size:', size);
      LogoManager.updateCurrentLogoState({ sizePercent: size });
      UIManager.updatePreview();
    });

    elements.removeLogoBtn.addEventListener('click', () => {
      console.log('[AppManager] Removing logo.');
      LogoManager.clearSelection();
      UIManager.updatePreview();
    });

    // Add event listener for center logo button if it exists
    if (elements.centerLogoBtn) {
      elements.centerLogoBtn.addEventListener('click', () => {
        centerCurrentLogo();
      });
    }

    // Save QR code using the centralized logo state
    elements.saveBtn.addEventListener('click', () => {
      const url = elements.urlInput.value.trim();
      if (!url) {
        alert('Please enter a valid URL.');
        return;
      }
      console.log('[AppManager] Saving QR code.');

      const logoState = LogoManager.getCurrentLogoState() || { xPercent: 50, yPercent: 50, sizePercent: 20, opacity: 1 };

      QRManager.getCombinedCanvas({
        url,
        foregroundColor: elements.qrColorPicker.value,
        backgroundColor: elements.colorPicker.value,
        logoData: LogoManager.getCurrentLogo()?.data || null,
        borderColor: elements.borderColorPicker.value,
        borderWidth: parseInt(elements.borderWidth.value, 10),
        customText: elements.textInput.value.trim(),
        textBackgroundColor: elements.textBackgroundColorPicker.value || null,
        // Use the logo state for consistency:
        logoSize: logoState.sizePercent,
        logoXPercent: logoState.xPercent,
        logoYPercent: logoState.yPercent,
        logoOpacity: logoState.opacity,
      }, (combinedCanvas) => {
        const snapshot = combinedCanvas.toDataURL();

        // Save the QR code with current customization details and logo state
        StorageManager.saveQRCode({
          id: currentEditId || Date.now().toString(),
          url,
          foregroundColor: elements.qrColorPicker.value,
          backgroundColor: elements.colorPicker.value,
          customText: elements.textInput.value.trim(),
          borderColor: elements.borderColorPicker.value,
          borderWidth: parseInt(elements.borderWidth.value, 10),
          logo: {
            data: LogoManager.getCurrentLogo()?.data,
            size: logoState.sizePercent,
            xPercent: logoState.xPercent,
            yPercent: logoState.yPercent,
            opacity: logoState.opacity,
          },
          textBackgroundColor: elements.textBackgroundColorPicker.value || null,
          snapshot, // Base64 representation of the combined canvas
        });

        console.log('[AppManager] QR code saved successfully.');
        currentEditId = null; // Reset editing session
        UIManager.renderDashboard();
      });
    });

    // Download QR code using the centralized logo state
    elements.downloadBtn.addEventListener('click', () => {
      const url = elements.urlInput.value.trim();
      if (!url) {
        alert('Please enter a valid URL.');
        return;
      }

      console.log('[AppManager] Downloading QR code.');

      const logoState = LogoManager.getCurrentLogoState() || { xPercent: 50, yPercent: 50, sizePercent: 20, opacity: 1 };

      QRManager.getCombinedCanvas({
        url,
        foregroundColor: elements.qrColorPicker.value,
        backgroundColor: elements.colorPicker.value,
        logoData: LogoManager.getCurrentLogo()?.data || null,
        borderColor: elements.borderColorPicker.value,
        borderWidth: parseInt(elements.borderWidth.value, 10),
        customText: elements.textInput.value.trim(),
        textBackgroundColor: elements.textBackgroundColorPicker.value || null,
        // Use the logo state for consistency:
        logoSize: logoState.sizePercent,
        logoXPercent: logoState.xPercent,
        logoYPercent: logoState.yPercent,
        logoOpacity: logoState.opacity
      }, (combinedCanvas) => {
        const link = document.createElement('a');
        link.href = combinedCanvas.toDataURL(); // Convert canvas to a PNG image.
        link.download = `qrcode-${Date.now()}.png`;
        link.click();

        console.log('[AppManager] QR code downloaded successfully.');
      });
    });

    // Event listener for the logo opacity slider.
        elements.logoOpacitySlider.addEventListener('input', (e) => {
          const sliderValue = parseInt(e.target.value, 10);
          const opacityValue = sliderValue / 100; // Convert 0–100 to 0–1
          elements.logoOpacityValue.textContent = sliderValue;
          LogoManager.updateCurrentLogoState({ opacity: opacityValue });
          UIManager.updatePreview();
        });
      };
    
      return {
        initialize() {
          console.log('[AppManager] Initializing application.');
          QRManager.setLogoProvider(LogoManager);
          LogoManager.init(); // Initialize logo handling.
          UIManager.renderDashboard(); // Render saved QR codes.
          setupEventListeners();
        },
        UIManager, // Expose UIManager externally if needed.
      };
    })();