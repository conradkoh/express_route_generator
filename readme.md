# Express route loader
This module generates a router from a folder, to allow easy implied route loading via directory structure.

## Sample usage:
``` Javascript
var RouteLoader = require('express_route_loader');
var router = RouterLoader.Attach('/', './routes');
var Express = require('express');
var App = Express();
App.use('/', router);
App.listen(8080, () => {
    console.log('listening');
})
```

## Project structure
```  
- routes  
    - home
        - router.js
```

## Sample router.js
``` Javascript
var Express = require('express');
var router = Express.Router();
router.use('/', (req, res) => {
    res.end('Welcome to the home page!');
});
module.exports = router;
```

Visit the page http://localhost:8080/home and you should see 'Welcome to the home page!'