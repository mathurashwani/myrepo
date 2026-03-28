# IoT Dashboard - Progressive Web App (PWA) Guide

## What is a PWA?

A Progressive Web App (PWA) is a web application that can be installed on your Android device and works like a native app. It provides:
- ✅ **Offline Access** - Works without internet (cached data)
- ✅ **Home Screen Icon** - Install like a regular app
- ✅ **Full Screen Mode** - No browser UI bars
- ✅ **Fast Loading** - Cached resources load instantly
- ✅ **Push Notifications** - Stay updated (future feature)
- ✅ **Auto Updates** - Always get the latest version

---

## Installing on Android Devices

### Method 1: Chrome Browser (Recommended)

1. **Open Chrome Browser** on your Android device
2. **Navigate to the app URL**: `https://your-app-url.com`
3. **Look for "Install" button** in the top toolbar (or tap the menu ⋮)
4. **Tap "Install"** or "Add to Home Screen"
5. **Confirm Installation** - The app icon will appear on your home screen
6. **Open the App** from your home screen

### Method 2: In-App Install Button

1. **Open the dashboard** in Chrome/Firefox
2. **Look for "INSTALL APP" button** in the header toolbar
3. **Tap the button** to trigger installation
4. **Follow the prompts** to add to home screen

### Method 3: Browser Menu

1. Open the app in **Chrome** or **Samsung Internet Browser**
2. Tap the **menu icon (⋮)** in the top-right corner
3. Select **"Add to Home screen"** or **"Install app"**
4. Name your app (default: "IoT Dashboard")
5. Tap **"Add"** or **"Install"**

---

## Features Available in PWA Mode

### ✅ Full Dashboard Functionality
- 5 sensor monitoring (Temperature, Humidity, Pressure)
- Real-time data visualization
- Line charts, bar charts, gauge charts
- Interactive data table

### ✅ Data Management
- Export data to CSV/PDF
- Date range selection
- Historical trend analysis

### ✅ Alert System
- Configure sensor alerts
- Set min/max thresholds
- Mocked email notifications

### ✅ Health Monitoring
- Sensor uptime tracking
- Maintenance schedules
- Failed readings count

### ✅ Auto-Refresh
- Toggle auto-refresh (30 seconds)
- Manual refresh button
- Last update timestamp

### ✅ Offline Mode
- View previously cached data
- Service worker caching
- Works without internet connection

---

## Android-Optimized Features

### Touch-Friendly Interface
- Large tap targets for easy interaction
- Responsive design for all screen sizes
- Optimized for portrait and landscape modes

### Mobile Performance
- Fast loading times
- Efficient data caching
- Smooth animations and transitions

### Battery Optimization
- Efficient API calls
- Optimized refresh intervals
- Background sync (when available)

---

## System Requirements

### Minimum Requirements
- **Android Version:** 5.0 (Lollipop) or higher
- **Browser:** Chrome 80+, Samsung Internet 11+, Firefox 85+
- **Storage:** ~5 MB for app cache
- **Internet:** Required for initial install and data updates

### Recommended
- **Android Version:** 10.0 or higher
- **Browser:** Chrome (latest version)
- **Storage:** 10 MB for optimal performance
- **Connection:** WiFi or 4G/5G for real-time updates

---

## PWA vs Native App Comparison

| Feature | PWA | Native Android App |
|---------|-----|-------------------|
| Installation | Via browser | Via Play Store |
| App Size | ~5 MB | ~20-50 MB |
| Updates | Automatic | Manual via Store |
| Offline Mode | ✅ Yes | ✅ Yes |
| Storage Access | Limited | Full |
| Performance | Very Good | Excellent |
| Development | Single codebase | Android-specific |

---

## Troubleshooting

### Issue: "Install" button not showing
**Solution:**
- Ensure you're using Chrome or supported browser
- Check if app is already installed
- Clear browser cache and reload
- Visit the site via HTTPS (required for PWA)

### Issue: App won't install
**Solution:**
- Check Android version (minimum 5.0)
- Ensure sufficient storage space
- Try using Chrome browser
- Check internet connection

### Issue: Offline mode not working
**Solution:**
- Open the app at least once with internet
- Allow browser to cache resources
- Check browser storage permissions

### Issue: Data not updating
**Solution:**
- Pull down to refresh (if supported)
- Tap the "Refresh" button in toolbar
- Check internet connection
- Verify backend server is running

### Issue: Charts not displaying correctly
**Solution:**
- Rotate device to landscape mode
- Zoom out if needed
- Clear app cache and reload
- Update browser to latest version

---

## Uninstalling the PWA

### Method 1: From Home Screen
1. **Long press** the app icon
2. Select **"Uninstall"** or **"Remove"**
3. Confirm removal

### Method 2: From Android Settings
1. Go to **Settings** → **Apps**
2. Find **"IoT Dashboard"**
3. Tap **"Uninstall"**

### Method 3: From Browser
1. Open **Chrome** → **Settings** → **Site Settings**
2. Find your app URL
3. Tap **"Clear & Reset"**

---

## Privacy & Permissions

The PWA requests minimal permissions:
- **Storage:** To cache data and resources
- **Network:** To fetch sensor data from backend

The app does NOT require:
- ❌ Camera access
- ❌ Microphone access
- ❌ Location services
- ❌ Contacts access

---

## Performance Tips

### For Best Performance:
1. **Enable WiFi** when available for faster updates
2. **Close unused browser tabs** to free memory
3. **Keep browser updated** to latest version
4. **Clear cache periodically** if app feels slow
5. **Use Auto-Refresh wisely** to save battery

### Battery Saving:
1. **Disable Auto-Refresh** when not actively monitoring
2. **Use Manual Refresh** as needed
3. **Close app** when not in use
4. **Enable Battery Saver** in Android settings

---

## Future PWA Features (Roadmap)

- 🔔 **Push Notifications** - Real-time alerts for sensor thresholds
- 📥 **Background Sync** - Auto-update data in background
- 📍 **Location-based** - Sensor selection by location
- 🌙 **Dark/Light Toggle** - Theme switching
- 📊 **Advanced Charts** - More visualization options
- 🔐 **Biometric Auth** - Fingerprint/Face unlock

---

## Testing on Desktop (Development)

You can test PWA features on desktop Chrome:

1. Open **Chrome DevTools** (F12)
2. Go to **Application** tab
3. Select **Service Workers** - Check if registered
4. Select **Manifest** - Verify PWA configuration
5. Select **Storage** - View cached resources
6. Use **Lighthouse** - Audit PWA score

---

## Support & Resources

### Official Documentation
- [Progressive Web Apps (MDN)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)

### Getting Help
- Check troubleshooting section above
- Review browser console for errors
- Ensure backend server is accessible
- Verify network connectivity

---

## Technical Details

### PWA Manifest
- **Short Name:** IoT Dashboard
- **Theme Color:** #00f0ff (Cyan)
- **Background Color:** #050505 (Dark)
- **Display Mode:** Standalone
- **Orientation:** Portrait Primary

### Service Worker
- **Cache Strategy:** Network-first, fallback to cache
- **Cached Resources:** HTML, CSS, JS, Manifest
- **Cache Version:** iot-dashboard-v1
- **Update Strategy:** Auto-update on new version

### Supported Features
- ✅ Installable
- ✅ Service Worker
- ✅ HTTPS (Required)
- ✅ Offline Mode
- ✅ Responsive Design
- ✅ Touch Optimized
- ✅ Fast Loading
- ✅ SEO Friendly

---

**Enjoy your IoT Dashboard as a mobile app! 🚀**
