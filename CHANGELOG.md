# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased](https://github.com/usgs/wdfn-graph-server/compare/wdfn-graph-server-0.36.0...master)
## [0.36.0](https://github.com/usgs/wdfn-graph-server/compare/wdfn-graph-server-0.35.0...wdfn-graph-server-0.36.0) - 2020-10-27
### Fixed
- Added WATERWATCH_ENDPOINT to application. It defaults to the service url so no changes to Dockerfile needed.

### Changed
- Updated Puppeteer to version 5.3.1

## [0.35.0](https://github.com/usgs/wdfn-graph-server/compare/wdfn-graph-server-0.34.0...wdfn-graph-server-0.35.0) - 2020-08-25
### Fixed
- OGC_SITE_ENDPOINT in Dockerfile is now set for the correct OGC endpoint.

## [0.34.0](https://github.com/usgs/wdfn-graph-server/compare/wdfn-graph-server-0.33.0...wdfn-graph-server-0.34.0) - 2020-08-19
### Fixed
-   Added additional required asset loading for the html rendered by puppeteer. 

## [0.33.0](https://github.com/usgs/wdfn-graph-server/tree/wdfn-graph-server-0.33.0) - 2020-08-17
### Changed
-   Code was moved from <https://github.com/usgs/waterdataui/tree/waterdataui-0.32.0/graph-server>.
This will now be a separately releasable artifact from waterdataui

### Added
-   Added endpoint, openapi.json, to return the openapi doc.