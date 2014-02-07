LeapJS Plugins
==============

This repository holds a collection of independent plugins which extend the functionality of LeapJS itself.

Here is an example showing the usage of the plugin hand-entry, which emits an event when a hand enters or leaves
the view.  Include a new version of leapjs and the plugin.  Then configure your controller to use the plugins, and
additional functionality will be available to you.  See [hand-entry](hand-entry) for details.

```html
<!-- your index.html -->
<script type="text/javascript" src="js/leap-0.4.0.js"></script>
<script type="text/javascript" src="js/lib/leap.hand-entry.js"></script>
<script type="text/javascript">
  var controller = new Leap.Controller();
  controller.use('handEntry')
</script>
```

 - Download [from the CDN](http://developer.leapmotion.com/leapjs/plugins).
 - Each plugin is individually documented, with demo, on the gh-pages [docs site](http://leapmotion.github.io/leapjs-plugins/docs/).
 - See [making plugins](http://github.com/leapmotion/leapjs/wiki/plugins) on the leapjs wiki.



Contributing
===============

 - Make a fork, name your branch, add your plugin or fix.
 - Add your name to the CONTRIBUTORS list, agreeing to the CLA
 - Open a Pull Request