var fs = require('fs');
var Path = require('path');
const ROUTER_FILENAME_DEFAULT = 'router.js';
/**
 * Configuration type definition
 * @typedef Configuration
 * @property {string} router_filename
 */

/**
 * Scans a folder and returns a router for all routes with matching filenames
 * @param {*} route 
 * @param {*} filepath 
 * @param {Configuration} config 
 */
module.exports.Attach = function Attach(route, filepath, config = {router_filename: ROUTER_FILENAME_DEFAULT}) {
    if(!config.router_filename) {
        config.router_filename = ROUTER_FILENAME_DEFAULT;
    }
    if (fs.existsSync(filepath)) {
        return Bind(route, Path.resolve(filepath), config);
    }
    console.error(`An error has occurred attempting to bind route '${route}' for path '${filepath}`);
    return undefined;
}
/**
 * Binds routes based on the routers loaded
 * @param {string} route the virtual path of the application
 * @param {string} filepath the directory path
 * @param {Configuration} config 
 */
function Bind(route, filepath, config) {
    var router = require('express').Router();
    var routes = GetRoutes(route, filepath, config);
    for (var bind in routes) {
        route = BindToRoute(bind);
        router.use(route, routes[bind]);
    }
    return router;
}

/**
 * Loads routers from a path and maps them to a base route
 * @param {string} route the virtual path of the application
 * @param {string} filepath the directory path
 * @param {Configuration} config
 */
function GetRoutes(route, filepath, config) {
    var diritems = fs.readdirSync(filepath);
    diritems = diritems ? diritems : [];
    var routers = {};
    for (var idx in diritems) {
        var itempath = Path.join(filepath, diritems[idx]);
        var stat = fs.lstatSync(itempath);
        if (stat.isDirectory()) {
            var bindpath = Path.join(route, diritems[idx]);
            var subroutes = GetRoutes(bindpath, itempath, config);
            for (var subroute in subroutes) {
                routers[subroute] = subroutes[subroute];
            }
        } else {
            //Each directory only binds router.js.
            //So we bind route (key) to imported router (value) if the filename is router.js
            if ((diritems[idx] == config.router_filename) && itempath) {
                routers[route] = require(itempath);
            }
        }
    }
    return routers;
}

/**
 * This function fixes the route for systems where web paths are delimited by / and dir paths are delimited by \
 * @param {string} route 
 */
function BindToRoute(route) {
    route = route.replace(/\\/g, '/')
    return route;
}