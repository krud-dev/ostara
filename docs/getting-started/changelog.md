# Changelog

### 0.12.0

#### Major Changes

* Added agents ([More Information](../documentation/agents/))

#### Minor Changes

* 556adb6c: Added snap support for main sidebar to allow full screen dashboard
* 41bf060f: Improved app updater mechanism
* 53150176: Added multi item selection and actions in the navigator tree

#### Patch Changes

* 01ed858c: Fixed react query offline behavior
* 7f29a900: Fixed ResizeObserver loop limit exceeded error
* 3bf39ce3: Fixed app updater quit and install
* 9945e576: Added network check to check for updates
* 30a02279: Fixed 'value' in actuator environment response not being transformable to string

### 0.11.0

#### Minor Changes

* 55a399d0: Added auto updating for Windows
* bec2a8cf: Added Info page
* 32e44c66: Added Health page
* 9057aefc: Added Logfile page
* f9a020d2: Added settings page with sections
* 7ef07f41: Added system backups manager to app settings
* ed26b3a8: Added metrics value formatting by unit
* 1825ea8a: Added UI animations
* acb26092: Added build and git info to instance
* 279a9319: Improved home screen feedback ui
* c9d870f4: Improved folder-applications and application-instances tables empty states
* 00e585ef: Added preview for import config and restore backup

#### Patch Changes

* d6253787: Fixed manually downloading updates to only allow one click
* ff984587: Fixed missing sort when exporting folders
* e5bde84c: Fixed navigator tree move/rename/delete async methods
* f6089d6d: Fixed slowness when navigating from instance dashboard to another page

### 0.10.0

#### Minor Changes

* 39de2121: Added application dashboard
* 1097b051: Added join discord buttons to home screen
* b56c2f46: Added notifications settings
* 230be293: Added ability to shutdown instances
* 421a4271: Added ability to cancel heapdump downloads
* 72697846: Added application health notifications
* 02d736a4: Added methods to send direct feedback
* a1218544: Added folder dashboard
* 26d11967: Added ability to configure notifications for metric changes
* bc717019: Added option to export / import configurations
* 52be8657: Added tooltips to navbar buttons
* fb235a9c: Updated start demo design to be more prominent
* 9fa6cf20: Added global dashboard
* 9188bc31: Added automatic selection of instance/application/folder on creation

#### Patch Changes

* c4ea9924: Fixed application health not updating after cache eviction
* 8b3732f8: Fixed instance active profiles overflow ui
* 5a4e450d: Change app updater to run once on app start if enabled
* b1877064: Fixed analytics not sending heartbeat event
* 8e8dc99d: Removed ability to move instances between applications
* 94527477: Fixed dashboard loading ui bug
* 58d20a08: Fixed demo created multiple times
* 216ec437: Fixed dashboard widget not available state
* c521002b: Fixed beans table dependency click not working when filtered
* 16e1599d: Fixed table action tooltip for disabled actions not interactable

### 0.9.0

#### Minor Changes

* 26211c7: Added manual app updates mechanism
* 3a04b8b: Added ability to disable SSL verification for applications
* 18b5f69: Added Togglz support
* 2b6508e: Added analytics heartbeat and additional demo events

#### Patch Changes

* c23fa41: Fixed demo application not opened on start
* 7d0e0e0: Fixed dashboard metric error handling
* 58b2df7: Fixed global api error handler invalid app rerenders

### 0.8.0

#### Minor Changes

* 1ed0b79: Added in-app demo
* 78106d6: Deep sort app properties keys alphabetically

#### Patch Changes

* 70fe8ca: Add missing pattern nullcheck to the multi date deserializer
* 5d7cfd2: Fixed grid text line break mid-word

### 0.7.0

#### Minor Changes

* debaf31: Added analytics events and disabled analytics in developer mode
* 75551a4: Rename app from Boost to Ostara
* 2614ab0: Added error boundary and user feedback on error

### 0.6.1

#### Patch Changes

* 43dc6f6: Added signature for x64 native sqlite library for mac

### 0.6.0

#### Minor Changes

* e3b5ce7: Added empty state to thread/heap dump tables
* e7819fb: Added loading state to log level toggle
* d9df5fe: Added redaction warning for masked actuator response

#### Patch Changes

* 8ace76b: Fixed analytics implementation with amplitude
* d3261ac: Fixed heapdump download in MacOS
* 7cc135d: Add default values to all fields in actuator responses

### 0.5.0

#### Minor Changes

* 789d2e0: Added app version updated dialog
* b67f7b4: Added default actuator url from clipboard to create instance form

#### Patch Changes

* 4e5930e: Fixed thread profiling thread data card ui
* f6849d2: Fixed navbar tooltip doesn't disappear when dragging
* 4384b82: Fixed URL regex not allowing dashes
* 4637100: Fix incorrect non-nullable type for dispatcherServlet in mappings response
* 87d4c87: Fixed update item icon ui
* 2c9ce4f: Fixed disable error reporting in renderer for development
* 31c8b52: Change Http Request Statistics by Statuses to be key by string instead of int
* b1ea44b: Fixed url regex path allowed characters

### 0.4.3

#### Patch Changes

* 1467cc0: Change update check frequency

### 0.4.2

#### Patch Changes

* 26a8c3b: Fixed windows icon size

### 0.4.1

#### Patch Changes

* b9094e7: Fix issue with app version not being present in packaged builds

### 0.4.0

#### Minor Changes

* 9e83a8e: Added automatic updates control to settings
* 1b92e5f: Added ability error guard for instance dashboard
* 7c8dbc0: Added selected item abilities polling and url ability guard
* d24a8e2: Added ability to control error reporting
* a272589: Added changelog to home with markdown component
* 04eae2f: Added explanation for disabled table row actions

#### Patch Changes

* f1da682: Fixed application caches add statistics

### 0.3.0

#### Minor Changes

* f798988: Added app version to splash and settings
* 5524c90: Added a new topic on Websocket for instance ability updates

#### Patch Changes

* 82f3c91: Fixed thread profiling cell click opens multiple details boxes
* 69ce337: Removed restriction on deleting ongoing thread profilings
* f290f42: Fixed table row/mass/global actions to disable while loading

### 0.2.0

#### Minor Changes

* aa109dc: Added help button to open relevant documentation for each page

#### Patch Changes

* bfef682: Fix incorrect sentry tag on renderer

### 0.1.0

#### Minor Changes

* f25831d: Added status and remaining time websocket updates to thread profiling requests
* 1efe919: Added the ability to disable Sentry data collection
* d23d27b: Added `anonymizeIp` to Google Analytics

#### Patch Changes

* c99c0f4: Improved thread profiling log palette
* fe68bef: Fixed HTTP requests statistics spinner not showing
