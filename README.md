![Bhasha Quill](bhasha-logo.png)

# Bhasha Quill
A QuillJs plugin to write in Sanskrit with support for IAST, Devanagari, and more.

## Demo
![Demo](demo.gif)

You can see a demo [here](https://trivedigaurav.com/exp/bhasha), or check out this [example](http://github.com/trivedigaurav/bhasha-quill-example/) repository.

## Getting Started

### Add npm dependency
```bash
npm install --save https://github.com/trivedigaurav/bhasha-quill
```
Or use your favorite package manager.

### Import Quill module
```javascript
import Bhasha from 'bhasha-quill';
Quill.register("modules/bhasha", Bhasha);

var quill = new Quill('#quill-container', {
    modules: {
        bhasha: {
            fromDropdown: '#bhasha-from',
            toDropdown: '#bhasha-to'
        }
    },
    theme: 'snow',
});
```

Pass the names of the from and to dropdowns to update the transliteration scheme as shown above.

### Transliteration Schemes
This plugin supports Devanagari, IAST, ITRANS, and other schemes by [Sanscript.js](https://github.com/sanskrit/sanscript.js/). 

#### IAST Simplified
I have also included a simplified IAST scheme that can be used to edit Sanskrit documents using ASCII characters available on a standard keyboard. This fork of Sanscript.js is available from http://github.com/trivedigaurav/sanscript.js/.

