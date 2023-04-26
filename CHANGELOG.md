# @krud-dev/boost

## 0.6.1

### Patch Changes

- 43dc6f6: Added signature for x64 native sqlite library for mac

## 0.6.0

### Minor Changes

- e3b5ce7: Added empty state to thread/heap dump tables
- e7819fb: Added loading state to log level toggle
- d9df5fe: Added redaction warning for masked actuator response

### Patch Changes

- 8ace76b: Fixed analytics implementation with amplitude
- d3261ac: Fixed heapdump download in MacOS
- 7cc135d: Add default values to all fields in actuator responses

## 0.5.0

### Minor Changes

- 789d2e0: Added app version updated dialog
- b67f7b4: Added default actuator url from clipboard to create instance form

### Patch Changes

- 4e5930e: Fixed thread profiling thread data card ui
- f6849d2: Fixed navbar tooltip doesn't disappear when dragging
- 4384b82: Fixed URL regex not allowing dashes
- 4637100: Fix incorrect non-nullable type for dispatcherServlet in mappings response
- 87d4c87: Fixed update item icon ui
- 2c9ce4f: Fixed disable error reporting in renderer for development
- 31c8b52: Change Http Request Statistics by Statuses to be key by string instead of int
- b1ea44b: Fixed url regex path allowed characters

## 0.4.3

### Patch Changes

- 1467cc0: Change update check frequency

## 0.4.2

### Patch Changes

- 26a8c3b: Fixed windows icon size

## 0.4.1

### Patch Changes

- b9094e7: Fix issue with app version not being present in packaged builds

## 0.4.0

### Minor Changes

- 9e83a8e: Added automatic updates control to settings
- 1b92e5f: Added ability error guard for instance dashboard
- 7c8dbc0: Added selected item abilities polling and url ability guard
- d24a8e2: Added ability to control error reporting
- a272589: Added changelog to home with markdown component
- 04eae2f: Added explanation for disabled table row actions

### Patch Changes

- f1da682: Fixed application caches add statistics

## 0.3.0

### Minor Changes

- f798988: Added app version to splash and settings
- 5524c90: Added a new topic on Websocket for instance ability updates

### Patch Changes

- 82f3c91: Fixed thread profiling cell click opens multiple details boxes
- 69ce337: Removed restriction on deleting ongoing thread profilings
- f290f42: Fixed table row/mass/global actions to disable while loading

## 0.2.0

### Minor Changes

- aa109dc: Added help button to open relevant documentation for each page

### Patch Changes

- bfef682: Fix incorrect sentry tag on renderer

## 0.1.0

### Minor Changes

- f25831d: Added status and remaining time websocket updates to thread profiling requests
- 1efe919: Added the ability to disable Sentry data collection
- d23d27b: Added `anonymizeIp` to Google Analytics

### Patch Changes

- c99c0f4: Improved thread profiling log palette
- fe68bef: Fixed HTTP requests statistics spinner not showing
