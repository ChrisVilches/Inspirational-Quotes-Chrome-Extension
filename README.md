# Inspirational Quotes (Chrome Extension)

Add inspirational/motivational quotes, and have them appear randomly while browsing. Keep yourself motivated.

## Install

1. Enable "developer mode" in Chrome by going to ```chrome://extensions/```.
2. Download/uncompress project.
3. Drag folder to Chrome extension manager page.
4. Click the extension icon, and add your first quote.

## Import/Export data

Database backup can be done manually. Go to the extension console and type the command:

```javascript
exportDatabase();
```

The output is the extension data (all quotes).

In order to import the data, type this command and paste the output into the function's argument:

```javascript
importDatabase( output here );
```

All quotes will be added again.
