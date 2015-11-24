[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

```js
import WS from 'monocules.ws-client'

WS
    .connect('my-connect-name', {
        url     : 'localhost:3000',
        options : {
            ...
        }
    })
    .then(
        success => {
            let pub1 = WS.publish('my-connect-name', {...});

            pub1.then(
                success => { ... },
                error => { ... }
            )

            let pub2 = WS.publish('my-connect-name.my-namespace', {...}); // Namespace
            
            pub2.then(
                success => { ... },
                error => { ... }
            )
        },
        error => {
            console.log(error);
        }
    );
```

## Installation

```bash
$ npm install monocules.ws-client
```