document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input');
    const preview = document.getElementById('signature-preview');
    const viewHtmlButton = document.getElementById('view-html-button');
    const copyButton = document.getElementById('copy-button');

    // Use URL fields for images
    const profilePictureUrlInput = document.getElementById('profile-picture-url');
    const companyLogoGroup = document.getElementById('esg-company-logo-group');
    const websiteGroup = document.getElementById('esg-website-group');
    let logoFieldCount = 1;
    let websiteFieldCount = 1;

    // Create initial hidden input for company logo
    const initialLogoUrl = document.createElement('input');
    initialLogoUrl.type = 'hidden';
    initialLogoUrl.className = 'company-logo-url';
    initialLogoUrl.id = 'company-logo-url-0';
    companyLogoGroup.insertBefore(initialLogoUrl, companyLogoGroup.querySelector('.input-desc'));

    // Set initial company logo URL
    const initialLogoSelect = document.getElementById('company-logo-select');
    initialLogoUrl.value = initialLogoSelect.value;

    // Handle file uploads
    function handleFileUpload(file, previewElement, urlInput) {
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Create and show preview
                const img = document.createElement('img');
                img.src = e.target.result;
                previewElement.innerHTML = '';
                previewElement.appendChild(img);
                
                // Update URL input with data URL
                urlInput.value = e.target.result;
                
                // Force preview update
                setTimeout(updatePreview, 0);
            };
            reader.readAsDataURL(file);
        }
    }

    // Profile picture upload handler
    const profilePictureUpload = document.getElementById('profile-picture-upload');
    const profilePicturePreview = document.getElementById('profile-picture-preview');
    profilePictureUpload.addEventListener('change', (e) => {
        handleFileUpload(e.target.files[0], profilePicturePreview, profilePictureUrlInput);
    });

    // Auto-convert Google Drive share link to direct image link for profile picture
    profilePictureUrlInput.addEventListener('input', function (e) {
        const val = profilePictureUrlInput.value.trim();
        // Google Drive share link pattern
        const match = val.match(/https?:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\//);
        if (match) {
            const fileId = match[1];
            const directLink = `https://drive.google.com/uc?export=view&id=${fileId}`;
            profilePictureUrlInput.value = directLink;
            updatePreview();
        }
    });

    // Add logo field logic
    function addLogoField(value = '') {
        const row = document.createElement('div');
        row.className = 'logo-selection';
        
        // Add logo select
        const select = document.createElement('select');
        select.className = 'company-logo-select';
        select.id = `company-logo-select-${logoFieldCount}`;
        
        // Add options
        const options = [
            { value: 'images/WCH_Logo_Horizontal_Color-1.png', text: 'Watsonville Community Hospital' },
            { value: 'images/Pajaro_Valley_Healthcare_Disctrict_Horizontal_Color.png', text: 'Pajaro Valley Healthcare District' },
            { value: 'images/Coastal_Healthcare_Color (1).png', text: 'Coastal Healthcare' },
            { value: 'images/Pajaro_Valley_Healthcare_Disctrict_Color.png', text: 'Pajaro Valley Healthcare District (Vertical)' }
        ];
        
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.text;
            select.appendChild(option);
        });
        
        row.appendChild(select);

        // Add hidden URL input
        const input = document.createElement('input');
        input.type = 'hidden';
        input.className = 'company-logo-url';
        input.value = value || options[0].value;
        input.id = `company-logo-url-${logoFieldCount}`;
        row.appendChild(input);

        // Remove button
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-logo-btn';
        removeBtn.title = 'Remove this logo';
        removeBtn.textContent = '–';
        removeBtn.onclick = () => {
            row.remove();
            updatePreview();
        };
        row.appendChild(removeBtn);

        // Insert before the description
        const desc = companyLogoGroup.querySelector('.input-desc');
        companyLogoGroup.insertBefore(row, desc);

        // Listen for select change
        select.addEventListener('change', (e) => {
            input.value = e.target.value;
            updatePreview();
        });

        logoFieldCount++;
    }

    // Handle initial company logo select
    initialLogoSelect.addEventListener('change', (e) => {
        initialLogoUrl.value = e.target.value;
        updatePreview();
    });

    // Add logo button logic
    const addLogoBtn = document.getElementById('add-logo-btn');
    addLogoBtn.onclick = () => {
        addLogoField();
    };

    // Social media toggle logic
    const socialToggleHeader = document.getElementById('esg-social-toggle-header');
    const socialLinksSection = document.getElementById('esg-social-links-section');
    const socialToggleIcon = document.getElementById('social-toggle-icon');
    let socialExpanded = true;

    function setSocialExpanded(expanded) {
        socialExpanded = expanded;
        if (expanded) {
            socialLinksSection.classList.remove('collapsed');
            socialToggleIcon.textContent = '▼';
        } else {
            socialLinksSection.classList.add('collapsed');
            socialToggleIcon.textContent = '▲';
        }
    }

    socialToggleHeader.addEventListener('click', () => {
        setSocialExpanded(!socialExpanded);
    });
    socialToggleHeader.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            setSocialExpanded(!socialExpanded);
        }
    });
    // Start expanded
    setSocialExpanded(true);

    // Function to update the preview
    function updatePreview() {
        const name = document.getElementById('name').value || 'John Doe';
        const title = document.getElementById('title').value || 'Software Engineer';
        const company = document.getElementById('company').value || 'Company Name';
        const email = document.getElementById('email').value || 'john@example.com';
        const phone = document.getElementById('phone').value || '+1 (555) 123-4567';
        const fax = document.getElementById('fax').value;
        const showIcons = document.getElementById('show-icons').checked;
        
        // Get custom colors
        const accentColor = document.getElementById('accent-color').value;
        const buttonColor = document.getElementById('button-color').value;
        
        // Get all website URLs
        const websiteInputs = websiteGroup.querySelectorAll('.website-url');
        let websites = Array.from(websiteInputs).map(input => input.value.trim()).filter(Boolean);
        if (websites.length === 0) {
            websites = ['https://example.com'];
        }
        
        // Social media links
        const linkedin = document.getElementById('linkedin').value;
        const twitter = document.getElementById('twitter').value;
        const facebook = document.getElementById('facebook').value;
        const instagram = document.getElementById('instagram').value;
        // No checkboxes, just use the values if present
        let socialMediaHTML = '';
        if (linkedin) socialMediaHTML += `<a href="${linkedin}" style="margin-right: 10px;"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="24" height="24" style="border: 0; display: inline-block; filter: grayscale(100%) brightness(0);"></a>`;
        if (twitter) socialMediaHTML += `<a href="${twitter}" style="margin-right: 10px;"><img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" width="24" height="24" style="border: 0; display: inline-block; filter: grayscale(100%) brightness(0);"></a>`;
        if (facebook) socialMediaHTML += `<a href="${facebook}" style="margin-right: 10px;"><img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" width="24" height="24" style="border: 0; display: inline-block; filter: grayscale(100%) brightness(0);"></a>`;
        if (instagram) socialMediaHTML += `<a href="${instagram}"><img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" width="24" height="24" style="border: 0; display: inline-block; filter: grayscale(100%) brightness(0);"></a>`;

        // Custom button options
        const showButton = document.getElementById('show-button').checked;
        const buttonText = document.getElementById('button-text').value;
        const buttonLink = document.getElementById('button-link').value;

        // Get image URLs
        const profilePictureUrl = profilePictureUrlInput.value.trim() || 'https://heroic.com/wp-content/uploads/placeholder-person.jpg';
        const showProfileImage = document.getElementById('show-profile-image').checked;
        // Gather all company logo URLs
        const logoInputs = companyLogoGroup.querySelectorAll('.company-logo-url');
        const companyLogoUrls = Array.from(logoInputs).map(input => input.value.trim()).filter(Boolean);

        // Icon HTML
        const phoneIcon = showIcons ? `<img style="width: 16px; margin-right: 4px; vertical-align: middle;" src="https://cdn-icons-png.flaticon.com/512/126/126341.png">` : '';
        const emailIcon = showIcons ? `<img style="width: 16px; margin-right: 4px; vertical-align: middle;" src="https://cdn-icons-png.flaticon.com/512/561/561127.png">` : '';
        const faxIcon = showIcons ? `<img style="width: 16px; margin-right: 4px; vertical-align: middle;" src="https://cdn-icons-png.flaticon.com/512/724/724664.png">` : '';
        const websiteIcon = showIcons ? `<img style="width: 16px; margin-right: 4px; vertical-align: middle;" src="https://cdn-icons-png.flaticon.com/512/535/535239.png">` : '';

        // Use modern, slightly larger, compact styles with unique accent
        const emailSafeHTML = `
            <meta http-equiv="Content-Type" content="text/html charset=UTF-8">
            <style type="text/css">
                table { border-collapse: collapse; mso-table-lspace: 0; mso-table-rspace: 0; }
                a, a:link, a:visited { text-decoration: underline; color: #434343; }
                a:hover { text-decoration: underline; }
                .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td {
                    font-family: Tahoma, Arial, Helvetica, sans-serif;
                    font-size: 13px;
                    mso-line-height-rule: exactly;
                    line-height: 120%;
                }
                .ExternalClass { width: 100%; }
            </style>
            <table cellspacing="0" border="0" style="font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 13px; border-collapse: collapse; mso-table-lspace: 0; mso-table-rspace: 0; box-shadow: 0 2px 12px ${accentColor}10, 0 6px 20px rgba(0,0,0,0.03); border-radius: 16px; margin: 10px; background: #fafbfc;">
                <tr>
                    <td style="width: 6px; background: ${accentColor}; border-radius: 16px 0 0 16px;" rowspan="3"></td>
                    <td width="${showProfileImage ? '120' : '0'}" style="width: ${showProfileImage ? '120px' : '0px'}; padding-right: ${showProfileImage ? '18px' : '0px'}; vertical-align: center; padding-left: ${showProfileImage ? '10px' : '0px'};" valign="center">
                        <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="line-height: 0px; padding-bottom: 0px;">
                                    ${showProfileImage && profilePictureUrl ? `<img class="signature-image" border="0" style="border: 0px; border-radius: 50%; width: 110px; height: 110px; display: block;" width="110" height="110" src="${profilePictureUrl}" alt="Profile Picture" onerror="this.style.display='none'">` : ''}
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td width="500" style="width: 500px; padding-left: 18px; padding-top: 10px; padding-bottom: 20px;vertical-align: top; mso-line-height-rule: exactly; line-height: 20px; border-left: 1px solid #f0f0f0; background: #fff; border-radius: 0 16px 0 0;" valign="top">
                        <span>
                            <span style="font-size: 18px; font-weight: bold; letter-spacing: 0.5px; color: ${accentColor}; display: inline-block;">${name.toUpperCase()}</span><br>
                        </span>
                        <span>
                            <span style="font-size: 15px; font-weight: 500; text-transform: uppercase; color: #444;">${title}</span><br>
                        </span>
                        <div style="background: linear-gradient(90deg, ${accentColor} 0%, #f0f0f0 100%); height: 2px; width: 60%; margin: 8px 0px 8px 0px; border-radius: 2px;"></div>
                        <span style="padding-top: 10px;">
                            ${phoneIcon}<span style="font-weight: 500;">${phone}</span>
                        </span><br>
                        <span>
                            ${emailIcon}<a style="text-decoration: underline; color: #434343; font-size: 13px;" href="mailto:${email}"><span>${email}</span></a>
                        </span><br>
                        ${fax ? `
                        <span>
                            ${faxIcon}<span>${fax}</span>
                        </span><br>
                        ` : ''}
                        ${websites.length > 0 ? `
                        <span>
                            ${websiteIcon}<span style="font-size: 13px;">
                                ${websites.map((website, index) => `
                                    <a style="text-decoration: underline; color: #434343;" href="${website}">${website}</a>
                                    ${index < websites.length - 1 ? ' | ' : ''}
                                `).join('')}
                            </span>
                        </span><br>
                        ` : ''}
                        ${showButton && buttonText && buttonLink ? `
                        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; mso-table-lspace: 0; mso-table-rspace: 0; margin-top: 8px;">
                            <tr>
                                <td style="padding-top: 4px; padding-bottom: 8px;">
                                    <table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 10pt; mso-line-height-rule: exactly; line-height: 19px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr style="background: ${buttonColor}; color: #ffffff;">
                                            <td style="font-weight: bold; padding: 8px 18px; border-radius: 5px;" class="button-link">
                                                <a style="color: white; text-decoration: none !important; display: inline-block; font-size: 14px;" href="${buttonLink}"><span>${buttonText}</span></a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        ` : ''}
                        ${socialMediaHTML ? `<div style="margin-top: 8px;">${socialMediaHTML}</div>` : ''}
                    </td>
                </tr>
                <tr>
                    <td colspan="3" width="600" style="width: 600px; font-size: 9px; padding: 10px 10px 5px 10px; text-align: left; background: #fafbfc; border-radius: 0 0 16px 16px; border-top: 1px solid #f0f0f0;">
                        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; mso-table-lspace: 0; mso-table-rspace: 0;">
                            <tr>
                                ${companyLogoUrls.map(url => url ? `<td style='padding-right: 16px; vertical-align: middle;'><img src="${url}" alt="Company Logo" height="38" style="vertical-align: middle; display: block; border: 0;" width="auto" onerror="this.style.display='none'"></td>` : '').join('')}
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        `;

        // Update the preview
        preview.innerHTML = emailSafeHTML;

        // Store the email-safe HTML for copying
        preview.dataset.emailSafeHtml = emailSafeHTML;
    }

    // Add event listeners to all inputs
    inputs.forEach(input => {
        if (input.type !== 'file') {
            input.addEventListener('input', updatePreview);
        }
    });

    // Copy functionality
    copyButton.addEventListener('click', () => {
        // Create a temporary div to hold the rendered content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = preview.dataset.emailSafeHtml;
        
        // Create a temporary container to copy from
        const tempContainer = document.createElement('div');
        document.body.appendChild(tempContainer);
        
        // Add the rendered content to the temporary container
        tempContainer.appendChild(tempDiv);
        
        // Select the content
        const range = document.createRange();
        range.selectNodeContents(tempDiv);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        
        try {
            // Copy the selected content
            document.execCommand('copy');
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = 'Copy Signature';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy signature:', err);
        }
        
        // Clean up
        document.body.removeChild(tempContainer);
        selection.removeAllRanges();
    });

    // HTML view functionality
    viewHtmlButton.addEventListener('click', () => {
        const signatureHTML = preview.innerHTML;
        const htmlView = document.createElement('div');
        htmlView.className = 'html-view';
        htmlView.textContent = signatureHTML;
        // Remove previous HTML view if it exists
        const existingView = document.querySelector('.html-view');
        if (existingView) {
            existingView.remove();
        }
        // Insert after the button container
        document.querySelector('.esg-button-container').after(htmlView);
    });

    // Initial preview update
    updatePreview();
}); 