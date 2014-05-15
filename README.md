LeapJS Plugins
==============

This repository holds a collection of independent plugins which extend the functionality of LeapJS itself.

**`leap-plugins.js`** is a collection of amazing plugins to get you started quickly.

 - **[Hand Entry](http://leapmotion.github.io/leapjs-plugins/docs/#hand-entry)** Emit events when a hand enters of leaves the field of view.
 - **[Hand Hold](http://leapmotion.github.io/leapjs-plugins/docs/#hand-hold)** Save data on to hands or fingers which will be persisted between frames.
 - **[Screen Position](http://leapmotion.github.io/leapjs-plugins/docs/#screen-position)** Get the on-screen position of any point in Leap-space.
 - **[Version Check](http://leapmotion.github.io/leapjs-plugins/docs/#version-check)** Ensure a minimum protocol version when running your app.
 - **[Playback](http://leapmotion.github.io/leapjs-plugins/docs/#playback)** Record hand-data from the Leap, compress it, and use it to animate your app.

**`leap-plugins-extras.js`** explores what can be done with LeapJS Plugins.

 - **[Proximity Alert](http://labs.leapmotion.com/proximity-alert-building-audio-feedback-with-a-new-leapjs-plugin/)** Explore the interaction box with audio feedback.
 
**Other libraries** 
 - **[Rigged Hand](https://github.com/leapmotion/leapjs-rigged-hand)** Easily add virtual 3d hands to any web page with THREE.js.

## Download

> &lt;script src="//js.leapmotion.com/leap-plugins-0.1.6.js"&gt;&lt;/script&gt;
<br/> &lt;script src="//js.leapmotion.com/leap-plugins-0.1.6.min.js"&gt;&lt;/script&gt;

## Usage

Include LeapJS >= 0.4.0 and either javascript file of an individual plugin or a collection.
Configure your controller to use the plugin, and that functionality will be available to you.
See [hand-entry](http://leapmotion.github.io/leapjs-plugins/docs/index.html#hand-entry) for docs on hand-entry itself.

```html
<!-- your index.html -->
<script type="text/javascript" src="js/leap-0.4.0.js"></script>
<script type="text/javascript" src="js/lib/leap.hand-entry.js"></script>
<script type="text/javascript">
  new Leap.Controller()
    .use('handEntry')
</script>
```

 - Download [from the CDN](http://developer.leapmotion.com/leapjs/plugins).
 - Each plugin is individually documented, with demo, on the gh-pages [docs site](http://leapmotion.github.io/leapjs-plugins/docs/).
 - See [making plugins](http://github.com/leapmotion/leapjs/wiki/plugins) on the leapjs wiki.



Contributing
===============

 - See README_DOCS for building the documentation (its one command!).
 - Make a fork, name your branch, add your plugin or fix.
 - Add your name, email, and github account to the CONTRIBUTORS.txt list, thereby agreeing to the terms and conditions of the Contributor License Agreement.
 - Open a Pull Request. If your information is not in the CONTRIBUTORS file, your pull request will not be reviewed.
