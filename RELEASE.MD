# Release Procedure

The release procedure is currently manual. Perform the following steps:

## Build

1. Run `npm package:all` to build the app for all platforms
2. Set aside releases for OS X DMG (arm64, x64), Windows exe (x64) and Linux (zip `-unpacked`) (x64) for the next step

## Release

1. Run `npm run release` - This will update the changelog, bump the version and create a new tag
2. Create a new release on GitHub with the new tag, and copy the changelog into the release notes
3. Add the OS X (arm64, x64), Windows (x64) and Linux (x64) builds to the release
