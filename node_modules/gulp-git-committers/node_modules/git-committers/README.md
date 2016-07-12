# git-committers

> Get a committer list from a git repository with some sorting and formatting options.

**Looking for a grunt task? [grunt-git-committers](https://github.com/dciccale/grunt-git-committers)**

```sh
$ npm install git-committers
```

### Example

```javascript
var gitCommitters = require('git-committers');

// logs output in console
gitCommitters();

// pass a callback
gitCommitters(function (err, output) {
  if (err) throw err;
  console.log(output);
});

// pass options
gitCommitters({email: true, sort: 'alphabetical'}, function (err, output) {
  // output including committer email
  // output sorted aphabetically
});
```

### Options

#### sort
Type: `String`
Default value: `chronological`

The sort type. Could be one of `chronological`, `alphabetical` or `commits`.

#### email
Type: `Boolean`
Default value: `false`

Set to `true` to include the emails beside the committers.

#### nomerges
Type: `Boolean`
Default value: `false`

Set to `true` to exclude merge commits. It only works when sorting by `commits`.

## License
MIT: http://denis.mit-license.org
