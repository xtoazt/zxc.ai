/**
 * Main application logic for Vider.ai
 * This file handles the task state management and API integration
 */

// define task manager as a global function so that alpine js can access it immediately
window.taskManager = function (taskType) {
    return {
      // Task states
      state: 'submission', // 'submission', 'processing', 'completed'
      taskId: null,
      queue: 2,
      needTime: 3,
      aspectRatio: 1,
      taskData: null,
      pollingInterval: null,
      pollingDelay: 5000, // 5 seconds between status checks
      imageUrl: null,
      isUploading: false,
      isSpeedingUp: false,
      resultVideo: null,
      history: [],
      nowPage: 0,
      taskType: taskType || 'free-ai-image-to-video-generator', // Task type for API endpoints
  
      // Initialize the task manager
      init () {
        console.log('Initializing task manager with task type:', this.taskType);
        // Create the API client with task type
        this.api = new window.MediaProcessor({ taskType: this.taskType });
  
        // Check if there's an existing task
        this.checkExistingTask();
        this.getHistory();
      },
  
  
  
      // Add force update method
      forceUpdate () {
        this.$nextTick(() => {
          if (this.$el) {
            this.$el.dispatchEvent(new CustomEvent('alpine:update'));
            console.log('Forced Alpine.js update');
          }
        });
      },
  
      async getHistory (page = 0) {
        try {
          this.nowPage += page;
          if (this.nowPage < 0) {
            this.nowPage = 0;
          }
          const response = await this.api.getTaskList({ skip: this.nowPage * 20, limit: 20 });
          console.log('History response:', response);
  
          // Clear array and reassign to ensure reactive update
          this.history = [];
          if (response.data && Array.isArray(response.data)) {
            // Use entire array assignment instead of pushing one by one
            //   this.history = response.data.filter(item => item.result && item.result.media);
            this.$nextTick(() => {
              console.log('History after update:', this.history.length);
              // Try adding a simple project to test rendering
              this.history.push({
                id: 'test-item',
                createTime: new Date().toISOString(),
                result: {
                  media: 'https://example.com/test-video.mp4'
                }
              });
              this.forceUpdate();
            });
          }
          console.log('Updated history:', this.history);
        } catch (error) {
          console.error('Error getting history:', error);
        }
      },
  
      // Check if there's an existing task
      async checkExistingTask () {
        try {
          const response = await this.api.getTaskStatus();
  
          if (response.code === 0 && response.data) {
            // We have an active task
            this.taskId = response.data.taskId;
            this.taskData = response.data;
            
            // Set state based on task status
            if (this.taskData.state == 3) {
              if (this.taskData.result.file_url) {
                this.state = 'completed';
                this.resultVideo = response.data.result.file_url;
              }
            } else if (this.taskData.state == 1) {
              this.state = 'processing';
            } else if (this.taskData.state == 0) {
              this.state = 'pending';
            }
            // Start polling for task updates
            this.startPolling();
          } else {
            // No active task, stay in submission state
            this.state = 'submission';
          }
        } catch (error) {
          console.error('Error checking task status:', error);
          this.state = 'submission';
        }
      },
  
      async uploadImage () {
        try {
          this.isUploading = true;
          const imageUrl = await this.doUploadImage();
          this.imageUrl = imageUrl;
          this.isUploading = false;
          return imageUrl;
        } catch (error) {
          console.error('Error uploading image:', error);
          this.isUploading = false;
          return null;
        }
      },
  
      async doUploadImage (maxWidth = 858, quality = 0.9) {
        return new Promise((resolve, reject) => {
          // Create file input element
          const fileInput = document.createElement('input');
          fileInput.type = 'file';
          fileInput.accept = 'image/*';
          fileInput.style.display = 'none';
          document.body.appendChild(fileInput);
  
          // Listen for file selection event
          fileInput.addEventListener('change', async (event) => {
            try {
              if (!event.target.files || !event.target.files[0]) {
                document.body.removeChild(fileInput);
                reject(new Error('No file selected'));
                return;
              }
  
              const file = event.target.files[0];
  
              // Check if it is an image file
              if (!file.type.startsWith('image/')) {
                document.body.removeChild(fileInput);
                reject(new Error('Selected file is not an image'));
                return;
              }
  
              // Compress image
              const compressedFile = await this.compressImageFile(file, maxWidth, quality);
  
              // Upload to S3
              const imageUrl = await this.uploadFileToS3(compressedFile);
  
              // Remove input element from DOM
              document.body.removeChild(fileInput);
  
              // Return uploaded URL
              resolve(imageUrl);
            } catch (error) {
              document.body.removeChild(fileInput);
              reject(error);
            }
          });
  
          // Automatically trigger file selection dialog
          fileInput.click();
        });
      },
  
      async uploadFileToS3 (file, tryNum) {
        tryNum = tryNum || 0;
        try {
          // Get signed URL from server
          const signRes = await this.api._request("/userFreeSignS3", {
            method: 'POST',
            body: {
              filename: file.name || 'test.jpg',
              tryNum: tryNum
            }
          });
  
          console.log('Sign response:', signRes);
  
          if (signRes.code !== 0) {
            throw new Error(signRes.msg || 'Failed to get upload URL');
          }
  
          const signedUrl = signRes.data.url;
          const resUrl = signRes.data.pubUrl;
  
          // Use fetch to upload file
          const uploadResponse = await fetch(signedUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': file.type
            },
            body: file
          });
  
          if (!uploadResponse.ok) {
            throw new Error(`Upload failed with status ${uploadResponse.status}`);
          }
  
          return resUrl;
        } catch (error) {
          console.error('Upload error:', error);
          if (tryNum < 5) {
            return await this.uploadFileToS3(file, tryNum + 1);
          } else {
            throw error;
          }
        }
      },
  
      async compressImageFile (file, maxWidth = 858, quality = 0.9) {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
  
            let { width, height } = img;
            if (width > maxWidth || height > maxWidth) {
              if (width > height) {
                height *= maxWidth / width;
                width = maxWidth;
              } else {
                width *= maxWidth / height;
                height = maxWidth;
              }
            }
  
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
  
            canvas.toBlob(
              (blob) => {
                const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                resolve(compressedFile);
              },
              'image/jpeg',
              quality
            );
          };
          img.onerror = reject;
          img.src = URL.createObjectURL(file);
        });
      },
  
      // Create a new task
      async createTask (params) {
        try {
          const response = await this.api.createTask(params);
  
          if (response.code === 0 && response.data) {
            // Task created successfully
            this.taskId = response.data.taskId;
            this.state = 'pending';
  
            // Start polling for task updates
            this.startPolling();
            return true;
          } else {
            console.error('Error creating task:', response.info);
            alert(response.info);
            return false;
          }
        } catch (error) {
          console.error('Error creating task:', error);
          return false;
        }
      },
  
      // Start polling for task updates
      startPolling () {
        if (this.pollingInterval) {
          clearInterval(this.pollingInterval);
        }
  
        this.pollingInterval = setInterval(() => {
          this.checkTaskStatus();
        }, this.pollingDelay);
      },
  
      // Stop polling for task updates
      stopPolling () {
        if (this.pollingInterval) {
          clearInterval(this.pollingInterval);
          this.pollingInterval = null;
        }
      },
  
      // Check the status of the current task
      async checkTaskStatus () {
        console.log('Checking task status...', this.taskId);
        if (!this.taskId) return;
        try {
          const response = await this.api.getTask(this.taskId);
          console.log('Checking task status:', response);
          if (response.code === 0 && response.data) {
            this.taskData = response.data;
  
            // Update state based on task status
            if (response.data.state === 3) {
              console.log('Task completed:', response.data);
              this.resultVideo = response.data.result.file_url;
              this.state = 'completed';
              this.stopPolling();
            } else if (response.data.state === 1) {
              this.state = 'processing';
              this.needTime = response.data.needTime;
              this.queue = response.data.queue;
            } else if (response.data.state === 0) {
              this.state = 'pending';
              this.needTime = response.data.needTime;
              this.queue = response.data.queue;
            }
          } else {
            console.error('Error checking task status:', response.info);
          }
        } catch (error) {
          console.error('Error checking task status:', error);
        }
      },
  
      // Reset to submission state
      resetToSubmission () {
        this.stopPolling();
        this.state = 'submission';
        this.taskId = null;
        this.taskData = null;
        this.imageUrl = null;
        this.resultVideo = null;
        this.isSpeedingUp = false;
      },
  
      // Cancel current task
      async cancelTask () {
        if (!this.taskId) return;
  
        try {
          // Stop polling immediately
          this.stopPolling();
  
          // Call API to cancel task
          await this.api.cancelTask(this.taskId);
  
          // Reset to submission state
          this.state = 'submission';
          this.taskId = null;
          this.taskData = null;
          this.queue = 2;
          this.needTime = 3;
          this.resultVideo = null;
  
          // Optional: Show confirmation message
          console.log('Task cancelled successfully');
  
        } catch (error) {
          console.error('Error cancelling task:', error);
          // Even if API call fails, reset the UI state
          this.resetToSubmission();
        }
      },
  
      // Speed up current task by upgrading to pro
      async speedUpTask () {
        if (!this.taskId || this.isSpeedingUp) return;
  
        try {
          // Call API to speed up task
          const response = await this.api.speedUpTask(this.taskId);
  
          if (response.code === 0) {
            // Set speeding up state to true on success
            this.isSpeedingUp = true;
  
            // Update queue and time estimates if provided
            if (response.data) {
              if (response.data.queue !== undefined) {
                this.queue = response.data.queue;
              }
              if (response.data.needTime !== undefined) {
                this.needTime = response.data.needTime;
              }
            }
  
            console.log('Task speed up successful');
  
            // Continue polling to check updated status
            this.checkTaskStatus();
          } else {
            console.error('Failed to speed up task:', response.info);
            alert(response.info || 'Failed to speed up task');
          }
  
        } catch (error) {
          console.error('Error speeding up task:', error);
          alert('Error speeding up task. Please try again.');
        }
      }
    };
  };
  
  // Other initialization after page load completion
  document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');
  
    // Check if MediaProcessor is available
    if (typeof MediaProcessor === 'undefined') {
      console.error('MediaProcessor is not defined! Check if vd-utils.js is loaded correctly.');
    } else {
      console.log('MediaProcessor is available');
    }
  });
  
  // SYS object for handling login and registration
  window.SYS = {
    openLogin () {
      // Open the sign dialog with login tab
      if (typeof $.magnificPopup !== 'undefined') {
        $.magnificPopup.open({
          items: {
            src: '#sign-dialog'
          },
          type: 'inline',
          callbacks: {
            open: function () {
              // Set the dialog to show login tab
              if (window.Alpine) {
                const dialog = document.querySelector('#sign-dialog');
                if (dialog && dialog._x_dataStack) {
                  const component = dialog._x_dataStack[0];
                  if (component && component.signTab !== undefined) {
                    component.signTab = 0; // 0 for login
                  }
                }
              }
            }
          }
        });
      } else {
        // Fallback if magnific popup is not available
        const dialog = document.getElementById('sign-dialog');
        if (dialog) {
          dialog.style.display = 'block';
          dialog.classList.remove('mfp-hide');
        }
      }
    },
  
    openRegister () {
      // Open the sign dialog with register tab
      if (typeof $.magnificPopup !== 'undefined') {
        $.magnificPopup.open({
          items: {
            src: '#sign-dialog'
          },
          type: 'inline',
          callbacks: {
            open: function () {
              // Set the dialog to show register tab
              if (window.Alpine) {
                const dialog = document.querySelector('#sign-dialog');
                if (dialog && dialog._x_dataStack) {
                  const component = dialog._x_dataStack[0];
                  if (component && component.signTab !== undefined) {
                    component.signTab = 1; // 1 for register
                  }
                }
              }
            }
          }
        });
      } else {
        // Fallback if magnific popup is not available
        const dialog = document.getElementById('sign-dialog');
        if (dialog) {
          dialog.style.display = 'block';
          dialog.classList.remove('mfp-hide');
        }
      }
    },
  
    openChangePassword () {
      // Toggle the change password modal using Alpine.js
      if (window.Alpine) {
        // Find the settings section with showChangePwd data
        const settingsElement = document.querySelector('div[x-data*="showChangePwd"]');
        if (settingsElement && settingsElement._x_dataStack) {
          const component = settingsElement._x_dataStack[0];
          if (component && component.showChangePwd !== undefined) {
            component.showChangePwd = !component.showChangePwd;
            return;
          }
        }
  
        // Fallback: try to find by looking at all elements with x-data
        const allDataElements = document.querySelectorAll('[x-data]');
        for (let element of allDataElements) {
          if (element._x_dataStack) {
            const component = element._x_dataStack[0];
            if (component && component.showChangePwd !== undefined) {
              component.showChangePwd = !component.showChangePwd;
              return;
            }
          }
        }
  
        console.log('Could not find showChangePwd component');
      }
    }
  };
  
  // Modal backdrop positioning fix
  window.fixModalBackdrop = function () {
    // Find all modal backdrops
    const modalBackdrops = document.querySelectorAll('.modal-backdrop, [class*="modal-backdrop"]');
  
    modalBackdrops.forEach(backdrop => {
      // Force set global positioning
      backdrop.style.position = 'fixed';
      backdrop.style.top = '0';
      backdrop.style.right = '0';
      backdrop.style.bottom = '0';
      backdrop.style.left = '0';
      backdrop.style.zIndex = '9999';
      backdrop.style.overflow = 'visible';
  
      // Ensure modal content can also display correctly
      const modalContent = backdrop.querySelector('*');
      if (modalContent) {
        modalContent.style.position = 'relative';
        modalContent.style.zIndex = '10000';
      }
    });
  };
  
  // Listen for DOM changes, automatically fix modal positioning
  // if (typeof MutationObserver !== 'undefined') {
  //   const observer = new MutationObserver(function (mutations) {
  //     mutations.forEach(function (mutation) {
  //       if (mutation.type === 'childList') {
  //         mutation.addedNodes.forEach(function (node) {
  //           if (node.nodeType === 1 && (node.classList.contains('modal-backdrop') ||
  //             node.className && node.className.includes('modal-backdrop'))) {
  //             // Newly added modal, fix positioning immediately
  //             setTimeout(() => window.fixModalBackdrop(), 0);
  //           }
  //         });
  //       }
  //     });
  //   });
  
  //   // Start observing
  //   observer.observe(document.body, {
  //     childList: true,
  //     subtree: true
  //   });
  // }
  
  // Also execute repair once after page load completion
  document.addEventListener('DOMContentLoaded', function () {
    // Delay execution to ensure all dynamic content is loaded
    setTimeout(() => window.fixModalBackdrop(), 100);
  });
  
  // DOM helper function
  function setDom (id, type, attr, value) {
    const element = document.getElementById(id)
    if (!element) return
  
    switch (type) {
      case 'style':
        element.style[attr] = value
        break
      case 'attr':
        element.setAttribute(attr, value)
        break
      case 'text':
        element.textContent = value
        break
      case 'html':
        element.innerHTML = value
        break
    }
  }
  
  function maskName (str) {
    if (!str) return '';
    if (str.length <= 10) return str;
    return str.slice(0, 4) + '***' + str.slice(-4);
  }
  
  // Initialize user info function
  function initUserInfo () {
    let userInfo = null
    try {
      // Try both 'user' and 'userInfo' keys for compatibility
      userInfo = JSON.parse(localStorage.getItem('user')) || JSON.parse(localStorage.getItem('userInfo'))
    } catch (e) {
      console.log('storeGet err:', e)
      return false
    }
  
    // Update Alpine.js component's isLogin state
    if (this && typeof this.isLogin !== 'undefined') {
      if (userInfo && userInfo.token) {
        this.isLogin = true
        this.userInfo = userInfo
      } else {
        this.isLogin = false
        this.userInfo = null
      }
    }
  
    if (!userInfo) return false
    if (!userInfo.token) return false
  
    // Update user info in DOM
    try {
      // Remove existing letter avatar to prevent duplicates
      document.querySelectorAll('.generated-avatar').forEach(el => el.remove())
  
      // Create letter avatar
      const userName = userInfo.user_name || 'U';
      const firstLetter = userName.charAt(0).toUpperCase();
      const letterAvatarHTML = `<div class="generated-avatar w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-grow-0 flex-shrink-0 text-white font-bold">${firstLetter}</div>`
  
      // Set letter avatar for mobile
      const sdkAvatar = document.getElementById('sdk-user-avatar')
      if (sdkAvatar) {
        sdkAvatar.style.display = 'none'
        sdkAvatar.insertAdjacentHTML('afterend', letterAvatarHTML)
      }
  
      // Set letter avatar for PC
      const pcAvatar = document.querySelector('.pc-user-avatar')
      if (pcAvatar) {
        pcAvatar.style.display = 'none'
        pcAvatar.insertAdjacentHTML('afterend', letterAvatarHTML)
      }
  
      // Set user name
      setDom('sdk-user-name', 'text', '', maskName(userInfo.user_name))
      const pcUserName = document.querySelector('.pc-user-name')
      if (pcUserName) pcUserName.textContent = maskName(userInfo.user_name)
  
      // Set user credit (handle both 'credit' and 'ava_credit')
      const credit = userInfo.ava_credit || 0
      setDom('sdk-user-credit', 'text', '', credit)
      const pcUserCredit = document.querySelector('.pc-user-credit')
      if (pcUserCredit) pcUserCredit.textContent = credit
    } catch (e) {
      console.log('Error setting user info:', e)
    }
  
    return true
  }
  
  // Initialize user info when DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    initUserInfo()
  })
  
  // Make initUserInfo available globally for Alpine.js
  window.initUserInfo = initUserInfo
  
  // Logout function
  window.logout = function () {
    if (confirm('Confirm logout?')) {
      localStorage.removeItem('user');
      localStorage.removeItem('userInfo');
      window.location.href = './index.html';
    }
  };
  