# WDFN Server-side Graph Renderer

[![Build Status](https://travis-ci.org/usgs/wdfn-graph-server.svg?branch=master)](https://travis-ci.org/usgs/wdfn-graph-server)
[![codecov](https://codecov.io/gh/usgs/wdfn-graph-server/branch/master/graph/badge.svg)](https://codecov.io/gh/usgs/wdfn-graph-server)

This project provides a node.js server-side rendering agent for Water Data For
The Nation graphs.

## API
### OpenAPI documentation for endpoints
```/api-docs```

### Status service
`/status```
Returns json object containing the  version of the running service

### Monitoring Location service  
```/monitoring-location/\<siteid\>/?parameterCode=xxxxx```
Returns a png containing a hydrograph for parameterCode(xxxxxx) for the NWIS site(siteid) for the
last seven days. The query parameter parameterCode is required and should be a valid NWIS parameter code (see 
<https://help.waterdata.usgs.gov/parameter_cd?group_cd=%>)

#### Optional query parameters
See the OpenAPI documentation for the current list of available list of query parameters

## Running the server for development
The dependencies need to be installed. To clear out any existing dependencies and to install:
```bash
% npm run clean
% npm install
```

The swagger json needs to be generated prior to running. If one of the convenience commands
below are used, the swagger json file is generated before the express server starts. If you want
to build separately the command is:
```bash
% npm run build:swagger
```

The entrypoint for the application is `src/index.js`, which accepts the following environment
variables as arguments:

-  PATH_CONTEXT: Default: /api/graph-images
-  NODE_PORT: Port to run http server on. Default 2929.
-  SERVICE_ROOT: Default: https://waterservices.usgs.gov/nwis
-  PAST_SERVICE_ROOT: Default: https://nwis.waterservices.usgs.gov/nwis
-  STATIC_ROOT: Default: https://waterdata.usgs.gov/nwisweb/wsgi/static
-  OGC_SITE_ENDPOINT: Default: https://labs.waterdata.usgs.gov/api/observations/collections/monitoring-locations/items/
-  DEBUG: Used to set portions of code to debug. By default this is blank but if desired set to express:* to debug the express routes
For example:
```bash
% NODE_PORT=80 node src/index.js
```

### Convenience scripts for running the server for local development
To run a server locally with debug set for express and using default environment variables
```bash
% npm run start
```

If you would like the server to automatically reload on code changes:
```bash
% npm run watch
```

### Running tests
Tests can be run by using the command:
```bash
% npm run test
```
By default this will expect the assets to be loaded at localhost:9000 for the images.
Typically this means that you should also be running the asset server for waterdataui.

To run the tests in watch mode use:
```bash
% npm run test:watch
```

### Miscellaneous scripts
You can run eslint against your javascript code using
```bash
% npm run lint
```

## Docker

For deployment, a docker image is built and then deployed. To mimic the same thing locally execute the following
from the root level of this repo:
```bash
% docker build -t wdfn_graph_server ./
% docker run -p 2929:2929 --privileged wdfn_graph_server
```
